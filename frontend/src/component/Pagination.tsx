import { useThemeStore } from "../store/useThemeStore";

type Props = {
  total: number;
  page: number;
  setPage: (p: number) => void;
  limit?: number;
};

export default function Pagination({ total, page, setPage, limit = 10 }: Props) {
  const pages = Math.max(1, Math.ceil(total / limit));
  const arr = Array.from({ length: pages }, (_, i) => i + 1);
 const { theme } = useThemeStore();
  return (
    <div className="flex gap-2 mt-4" data-theme={theme}>
      <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
      {arr.map(p => (
        <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPage(p)}>
          {p}
        </button>
      ))}
      <button className="btn btn-sm" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
