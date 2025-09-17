import { useEffect, useState } from "react";
import { api } from "./lib/api";

function BannerErro({ msg }) {
  if (!msg) return null;
  return (
    <div className="mb-4 p-3 rounded bg-red-600/20 text-red-300 border border-red-600">
      <strong>Erro:</strong> {msg}
    </div>
  );
}

export default function App() {
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({ nome: "", cargaHoraria: "", dataInicio: "" });
  const [disciplinaNome, setDisciplinaNome] = useState("");
  const [editCH, setEditCH] = useState({});
  const [erro, setErro] = useState("");
  const [reloadTick, setReloadTick] = useState(0);

  async function load() {
    try {
      setErro("");
      const data = await api.get("/cursos");
      setCursos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErro(e.message || "Falha ao carregar cursos");
    }
  }

  useEffect(() => { load(); }, []);

  async function criarCurso(e) {
    e.preventDefault();
    try {
      setErro("");
      if (!form.nome || !form.cargaHoraria || !form.dataInicio) {
        return setErro("Preencha todos os campos do curso.");
      }
      await api.post("/cursos", {
        nome: form.nome,
        cargaHoraria: Number(form.cargaHoraria),
        dataInicio: form.dataInicio,
      });
      setForm({ nome: "", cargaHoraria: "", dataInicio: "" });
      await load();
    } catch (e) {
      console.error(e);
      setErro(e.message || "Falha ao criar curso");
    }
  }

  async function deletarCurso(id) {
    try {
      setErro("");
      await api.del(`/cursos/${id}`);
      await load();
      setReloadTick(t => t + 1);
    } catch (e) {
      console.error(e);
      setErro(e.message || "Falha ao excluir curso");
    }
  }

  async function atualizarCargaHoraria(id) {
    try {
      setErro("");
      const valor = Number(editCH[id]);
      if (!valor) return setErro("Informe uma carga horária válida.");
      await api.patch(`/cursos/${id}`, { cargaHoraria: valor });
      setEditCH((s) => ({ ...s, [id]: "" }));
      await load();
    } catch (e) {
      console.error(e);
      setErro(e.message || "Falha ao atualizar carga horária");
    }
  }

  async function addDisciplina(id) {
    try {
      setErro("");
      if (!disciplinaNome) return setErro("Digite o nome da disciplina.");
      await api.post(`/cursos/${id}/disciplinas`, { nome: disciplinaNome });
      setDisciplinaNome("");
      await load();
      setReloadTick(t => t + 1);
    } catch (e) {
      console.error(e);
      setErro(e.message || "Falha ao adicionar disciplina");
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-6">
      {/* LARGURA MAIOR */}
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-5xl font-extrabold">Cursos & Disciplinas</h1>

        <BannerErro msg={erro} />

        {/* Form em linha ocupando toda a largura */}
        <form
          onSubmit={criarCurso}
          className="bg-gray-900 p-4 rounded-xl grid gap-3 lg:grid-cols-[2fr_1fr_1fr_auto]"
        >
          <input
            className="p-3 rounded bg-gray-800"
            placeholder="Nome do curso"
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
          />
          <input
            type="number"
            className="p-3 rounded bg-gray-800"
            placeholder="Carga Horária"
            value={form.cargaHoraria}
            onChange={(e) => setForm((f) => ({ ...f, cargaHoraria: e.target.value }))}
          />
          <input
            type="date"
            className="p-3 rounded bg-gray-800"
            value={form.dataInicio}
            onChange={(e) => setForm((f) => ({ ...f, dataInicio: e.target.value }))}
          />
          <button className="px-6 py-3 rounded bg-emerald-600 hover:bg-emerald-500 transition font-medium">
            Criar Curso
          </button>
        </form>

        {/* Campo para nova disciplina */}
        <div className="bg-gray-900 p-4 rounded-xl flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="flex-1 p-3 rounded bg-gray-800"
            placeholder="Nome da nova disciplina"
            value={disciplinaNome}
            onChange={(e) => setDisciplinaNome(e.target.value)}
          />
          <span className="text-xs text-gray-400">
            Digite e clique em “+ Disciplina” no curso desejado
          </span>
        </div>

        {/* GRID que ocupa a tela: 1 / 2 / 3 colunas */}
        {cursos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900 p-10 text-center">
            <p className="text-lg text-gray-300 font-medium">Nenhum curso cadastrado ainda.</p>
            <p className="text-sm text-gray-400 mt-1">
              Preencha o formulário acima e clique em <span className="font-semibold">“Criar Curso”</span>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cursos.map((c) => (
              <div key={c.id} className="bg-gray-900 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-semibold">{c.nome}</div>
                    <div className="text-sm text-gray-300">
                      CH: {c.cargaHoraria} • Início: {String(c.dataInicio).slice(0, 10)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addDisciplina(c.id)}
                      className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-sm"
                    >
                      + Disciplina
                    </button>
                    <button
                      onClick={() => deletarCurso(c.id)}
                      className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                {/* atualizar CH */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Nova Carga Horária"
                    className="p-2 rounded bg-gray-800 w-40"
                    value={editCH[c.id] ?? ""}
                    onChange={(e) => setEditCH((s) => ({ ...s, [c.id]: e.target.value }))}
                  />
                  <button
                    onClick={() => atualizarCargaHoraria(c.id)}
                    className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-sm"
                  >
                    Atualizar
                  </button>
                </div>

                <Disciplinas cursoId={c.id} reload={reloadTick} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Disciplinas({ cursoId, reload }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [erro, setErro] = useState("");

  async function carregar() {
    try {
      setErro("");
      const detail = await api.get(`/cursos/${cursoId}`);
      setDisciplinas(detail?.disciplinas || []);
    } catch (e) {
      console.error(e);
      setErro(e.message || "Falha ao carregar disciplinas");
    }
  }

  useEffect(() => { carregar(); }, [cursoId, reload]);

  if (erro) return <div className="text-sm text-red-300">Erro: {erro}</div>;
  if (!disciplinas.length) return <div className="text-sm text-gray-400">Sem disciplinas ainda.</div>;

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-400">Disciplinas:</div>
      {disciplinas.map((d) => (
        <LinhaDisciplina key={d.id} d={d} cursoId={cursoId} onChange={carregar} />
      ))}
    </div>
  );
}

function LinhaDisciplina({ d, cursoId, onChange }) {
  const [erro, setErro] = useState("");

  const remover = async () => {
    try {
      setErro("");
      await api.del(`/cursos/${cursoId}/disciplinas/${d.id}`);
      onChange();
    } catch (e) {
      console.error(e);
      setErro(e.message || "Falha ao remover");
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 rounded p-2">
      <span>{d.nome}</span>
      <div className="flex items-center gap-2">
        {erro && <span className="text-xs text-red-300">{erro}</span>}
        <button onClick={remover} className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-xs">
          Remover
        </button>
      </div>
    </div>
  );
}
