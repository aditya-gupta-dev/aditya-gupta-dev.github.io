export function Castle({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={small ? "castle small" : "castle"}
      viewBox="0 0 240 150"
      fill="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path
        d="M18 128h204v4H18zM30 120h180v8H30zM43 112h155v8H43z"
        fill="#88856a"
      />
      <path
        d="M42 111V61h28v50M170 111V61h28v50M78 112V77h84v35M91 78V45h58v33"
        fill="#a29474"
      />
      <path
        d="M39 61h34v7H39zM167 61h34v7h-34zM88 44h64v8H88z"
        fill="#625e4c"
      />
      <path
        d="M39 61V50h7v6h7v-6h7v6h7v-6h6v11M167 61V50h7v6h7v-6h7v6h7v-6h6v11M88 44V33h8v6h8v-6h8v6h8v-6h8v6h8v-6h8v6h8v-6h0v11"
        fill="#625e4c"
      />
      <path d="M113 33V14h3v19" fill="#625e4c" />
      <path d="M116 14h21v5h-5v6h-16z" fill="#803a3b" />
      <path
        d="M108 112V91h5v-6h14v6h5v21zM51 77h9v15h-9zM179 77h9v15h-9zM103 59h6v11h-6zM132 59h6v11h-6z"
        fill="#4f5044"
      />
      <path
        d="M46 101h7v3h-7zM63 72h7v3h-7zM81 87h12v3H81zM146 102h12v3h-12zM174 96h9v3h-9zM121 76h11v3h-11zM94 53h6v3h-6z"
        fill="#c6b994"
      />
      <path
        d="M17 113h4V85h4v28h6v4H11v-4zM10 101V89h6v-8h13v8h6v12zM209 115V89h4v26M201 104V90h5v-9h12v9h5v14z"
        fill="#6d795d"
      />
      <path d="M106 117h28v5h9v5h11v5H91v-5h7v-5h8z" fill="#c2b28a" />
      <path
        d="M36 26h3v3h-3zM190 24h3v3h-3zM205 46h3v3h-3zM67 20h3v3h-3zM161 14h3v3h-3zM24 54h3v3h-3z"
        fill="#a8956b"
      />
      <path
        d="M172 35h5v-5h3v5h5v3h-5v5h-3v-5h-5zM57 36h4v-4h2v4h4v2h-4v4h-2v-4h-4z"
        fill="#a8956b"
      />
    </svg>
  );
}
