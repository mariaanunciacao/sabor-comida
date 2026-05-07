"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import Image from "next/image";
import { getMyRestaurant, getRestaurantImage, updateMyRestaurant } from "../../../lib/api";
import { loadAuthSession } from "../../../lib/session";
import { MdOutlinePhotoCamera, MdOutlineSchedule, MdOutlineBusiness, MdOutlineDescription, MdOutlineSave, MdOutlinePlace, MdOutlineMap, MdOutlineLocationOn } from "react-icons/md";

const MapPicker = dynamic(() => import("../../../components/MapPicker"), { ssr: false });

const fields = [
  { title: 'Identificação', description: 'Nome do restaurante, CNPJ e descrição pública.', icon: MdOutlineBusiness },
  { title: 'Imagens', description: 'Logo e banner usados no catálogo e na vitrine.', icon: MdOutlinePhotoCamera },
  { title: 'Operação', description: 'Horário de atendimento e tempo estimado de entrega.', icon: MdOutlineSchedule },
  { title: 'Localização', description: 'Endereço principal usado para análise e exibição no app.', icon: MdOutlinePlace },
];

const addressFields = [
  { label: 'Logradouro', key: 'logradouro', placeholder: 'Rua, avenida, travessa...' },
  { label: 'Número', key: 'numero', placeholder: '123' },
  { label: 'CEP', key: 'cep', placeholder: '00000-000' },
  { label: 'Bairro', key: 'bairro', placeholder: 'Bairro' },
  { label: 'Cidade', key: 'cidade', placeholder: 'São Paulo' },
  { label: 'Estado', key: 'estado', placeholder: 'SP' },
];

function normalizeTimeValue(value) {
  if (!value) {
    return '';
  }

  const text = String(value).trim();
  return text.length >= 5 ? text.slice(0, 5) : text;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [restaurantId, setRestaurantId] = useState(null);
  const [statusAprovacao, setStatusAprovacao] = useState('pendente');
  const [canEdit, setCanEdit] = useState(false);
  const [formData, setFormData] = useState({
    cnpj: '',
    nome_restaurante: '',
    descricao: '',
    logo_path: '',
    banner_path: '',
    horario_atendimento: '',
    tempo_entrega: '',
    logradouro: '',
    numero: '',
    cep: '',
    bairro: '',
    latitude: '',
    longitude: '',
    cidade: '',
    estado: '',
  });

  useEffect(() => {
    async function loadRestaurant() {
      const session = loadAuthSession();
      const tipo = session?.tipo ?? session?.perfil;

      if (!session?.token || (tipo !== 'restaurante' && tipo !== 'restaurante_pendente')) {
        setCanEdit(false);
        setMessage('Acesse com um usuário de restaurante para editar estas informações.');
        setLoading(false);
        return;
      }

      setCanEdit(true);

      try {
        const restaurant = await getMyRestaurant(session.token);
        setRestaurantId(restaurant.restaurante?.id ?? restaurant.id ?? null);
        setStatusAprovacao(restaurant.statusAprovacao ?? restaurant.status_aprovacao ?? 'pendente');
        setFormData({
          cnpj: restaurant.restaurante?.cnpj ?? restaurant.cnpj ?? '',
          nome_restaurante: restaurant.restaurante?.nome_restaurante ?? restaurant.nome_restaurante ?? '',
          descricao: restaurant.restaurante?.descricao ?? restaurant.descricao ?? '',
          logo_path: restaurant.restaurante?.logo_path ?? restaurant.logo_path ?? '',
          banner_path: restaurant.restaurante?.banner_path ?? restaurant.banner_path ?? '',
          horario_atendimento: restaurant.restaurante?.horario_atendimento ?? restaurant.horario_atendimento ?? '',
          tempo_entrega: normalizeTimeValue(restaurant.restaurante?.tempo_entrega ?? restaurant.tempo_entrega),
          logradouro: restaurant.restaurante?.enderecoPrincipal?.logradouro ?? restaurant.enderecoPrincipal?.logradouro ?? '',
          numero: restaurant.restaurante?.enderecoPrincipal?.numero ?? restaurant.enderecoPrincipal?.numero ?? '',
          cep: restaurant.restaurante?.enderecoPrincipal?.cep ?? restaurant.enderecoPrincipal?.cep ?? '',
          bairro: restaurant.restaurante?.enderecoPrincipal?.bairro ?? restaurant.enderecoPrincipal?.bairro ?? '',
          cidade: restaurant.restaurante?.enderecoPrincipal?.cidade ?? restaurant.enderecoPrincipal?.cidade ?? '',
          estado: restaurant.restaurante?.enderecoPrincipal?.estado ?? restaurant.enderecoPrincipal?.estado ?? '',
          latitude: restaurant.restaurante?.enderecoPrincipal?.latitude ?? restaurant.enderecoPrincipal?.latitude ?? '',
          longitude: restaurant.restaurante?.enderecoPrincipal?.longitude ?? restaurant.enderecoPrincipal?.longitude ?? '',
        });

        if (!restaurant.restaurante) {
          setMessage(restaurant.message ?? 'Preencha os dados do restaurante para enviar à análise.');
        }
      } catch (error) {
        setMessage(error?.message ?? 'Não foi possível carregar os dados do restaurante.');
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, []);

  async function handleCepLookup(cepRaw) {
    const cep = String(cepRaw || formData.cep).replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;

    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await resp.json();

      if (data.erro) {
        setMessage('CEP não encontrado.');
        return;
      }

      setFormData((current) => ({
        ...current,
        logradouro: data.logradouro ?? current.logradouro,
        bairro: data.bairro ?? current.bairro,
        cidade: data.localidade ?? current.cidade,
        estado: data.uf ?? current.estado,
        cep: data.cep ?? current.cep,
      }));

      // optional: geocode via Nominatim to get approximate lat/lon
      try {
        const q = encodeURIComponent(`${data.logradouro ?? ''}, ${data.localidade ?? data.uf ?? ''} Brasil`);
        const nom = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`, { headers: { 'User-Agent': 'sabor-comida-app' } });
        const nomJson = await nom.json();
        if (nomJson && nomJson[0]) {
          setFormData((current) => ({ ...current, latitude: nomJson[0].lat, longitude: nomJson[0].lon }));
        }
      } catch (e) {
        // ignore geocode errors
      }
    } catch (error) {
      setMessage('Erro ao consultar CEP.');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const session = loadAuthSession();

      if (!session?.token) {
        setMessage('Acesse com um usuário de restaurante para salvar estas informações.');
        return;
      }

      const response = await updateMyRestaurant(session.token, {
        cnpj: formData.cnpj,
        nome_restaurante: formData.nome_restaurante,
        descricao: formData.descricao,
        logo_path: formData.logo_path,
        banner_path: formData.banner_path,
        horario_atendimento: formData.horario_atendimento,
        tempo_entrega: formData.tempo_entrega,
        logradouro: formData.logradouro,
        numero: formData.numero,
        cep: formData.cep,
        cidade: formData.cidade,
        estado: formData.estado,
        bairro: formData.bairro,
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      setRestaurantId(response.restaurante?.id ?? restaurantId);
      setStatusAprovacao(response.statusAprovacao ?? response.restaurante?.statusAprovacao ?? response.restaurante?.status_aprovacao ?? 'pendente');
      setMessage('Informações enviadas para análise e salvas no banco.');
    } catch (error) {
      setMessage(error?.message ?? 'Não foi possível salvar as informações agora.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-orange-100 bg-white p-6 text-sm text-slate-600 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
        Carregando seus dados de restaurante...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">Cadastro do restaurante</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Envie os dados do restaurante e do endereço em uma única etapa</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Aqui você preenche o cadastro completo que será salvo no banco e depois revisado pelo administrador.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {fields.map((field) => {
            const Icon = field.icon;

            return (
              <div key={field.title} className="rounded-[1.5rem] border border-orange-100 bg-orange-50/60 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
                  <Icon className="size-6" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{field.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{field.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-dashed border-orange-200 bg-orange-50/50 p-6">
          

          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Dados para análise</h2>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700">Restaurante #{restaurantId ?? 'novo'}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusAprovacao === 'aprovado' ? 'bg-emerald-100 text-emerald-800' : statusAprovacao === 'rejeitado' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                {statusAprovacao === 'aprovado' ? 'Aprovado' : statusAprovacao === 'rejeitado' ? 'Rejeitado' : 'Pendente'}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InputField label="Nome do restaurante" value={formData.nome_restaurante} onChange={(value) => setFormData((current) => ({ ...current, nome_restaurante: value }))} placeholder="Digite o nome do restaurante" />
            <InputField label="CNPJ" value={formData.cnpj} onChange={(value) => setFormData((current) => ({ ...current, cnpj: value }))} placeholder="00.000.000/0001-00" />
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(event) => setFormData((current) => ({ ...current, descricao: event.target.value }))}
                placeholder="Conte ao admin o que seu restaurante oferece"
                className="min-h-28 w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
              />
            </div>
            <InputField label="Logo (URL ou caminho)" value={formData.logo_path} onChange={(value) => setFormData((current) => ({ ...current, logo_path: value }))} placeholder="/logos/meu-restaurante.png" />
            <InputField label="Banner (URL ou caminho)" value={formData.banner_path} onChange={(value) => setFormData((current) => ({ ...current, banner_path: value }))} placeholder="/banners/meu-restaurante.png" />
            <InputField label="Horário de atendimento" value={formData.horario_atendimento} onChange={(value) => setFormData((current) => ({ ...current, horario_atendimento: value }))} placeholder="08:00 às 22:00" />
            <InputField label="Tempo de entrega" value={formData.tempo_entrega} onChange={(value) => setFormData((current) => ({ ...current, tempo_entrega: value }))} placeholder="00:30" />
          </div>

          <div className="mt-8 rounded-[2rem] border border-white bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <MdOutlineLocationOn className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Endereço principal</h3>
                <p className="text-sm text-slate-600">Esses dados também serão analisados pelo administrador e usados na vitrine.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {addressFields.map((field) => (
                <InputField
                  key={field.key}
                  label={field.label}
                  value={formData[field.key]}
                  onChange={(value) => setFormData((current) => ({ ...current, [field.key]: value }))}
                  placeholder={field.placeholder}
                  onBlur={field.key === 'cep' ? () => handleCepLookup() : undefined}
                />
              ))}
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">Localização no mapa</label>
              <MapPicker
                initialPosition={[
                  formData.latitude ? Number(formData.latitude) : -14.2350,
                  formData.longitude ? Number(formData.longitude) : -51.9253,
                ]}
                initialZoom={formData.latitude ? 15 : 4}
                onChange={({ latitude, longitude }) => setFormData((current) => ({ ...current, latitude, longitude }))}
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input value={formData.latitude} onChange={(e) => setFormData((c) => ({ ...c, latitude: e.target.value }))} placeholder="Latitude" className="w-full rounded-2xl border border-orange-100 px-3 py-2" />
                <input value={formData.longitude} onChange={(e) => setFormData((c) => ({ ...c, longitude: e.target.value }))} placeholder="Longitude" className="w-full rounded-2xl border border-orange-100 px-3 py-2" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || !canEdit}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MdOutlineSave />
              {saving ? 'Salvando...' : 'Enviar para análise'}
            </button>
            
          </div>

          <p className="mt-4 text-sm text-slate-600">
            {statusAprovacao === 'aprovado'
              ? 'Seu restaurante já foi aprovado pelo administrador.'
              : statusAprovacao === 'rejeitado'
                ? 'Seu cadastro foi rejeitado. Ajuste as informações e envie novamente.'
                : 'Seu cadastro está pendente de análise do administrador.'}
          </p>

          {message ? <p className="mt-4 text-sm text-amber-700">{message}</p> : null}
        </form>

        <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-[0_14px_40px_rgba(249,115,22,0.10)]">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Prévia do que será analisado</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            O administrador vai receber essas informações para validar o cadastro e liberar o restaurante.
          </p>

          <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-orange-100 bg-white shadow-sm">
            <div className="relative h-44 bg-orange-50">
              <Image
                src={getRestaurantImage(formData, 'banner')}
                alt="Prévia do banner"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-slate-900">{formData.nome_restaurante || 'Nome do restaurante'}</h3>
              <p className="mt-1 text-sm text-slate-500">{formData.cnpj || 'CNPJ pendente'}</p>
              <p className="mt-3 text-sm text-slate-700">{formData.descricao || 'Descrição pendente'}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Horário: {formData.horario_atendimento || 'não informado'}</p>
                <p>Tempo de entrega: {formData.tempo_entrega || 'não informado'}</p>
                <p>Endereço: {formData.logradouro || 'logradouro'}{formData.numero ? `, ${formData.numero}` : ''}</p>
                <p>{formData.cidade || 'cidade'} / {formData.estado || 'estado'} {formData.cep ? `- ${formData.cep}` : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, onBlur }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-gray-700 shadow-sm outline-none transition focus:border-[color:var(--color-botao-pesquisa)] focus:ring-2 focus:ring-[color:var(--color-botao-pesquisa)]/20"
      />
    </div>
  );
}