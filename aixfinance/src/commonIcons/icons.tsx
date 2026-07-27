export const miniIconRound = (src: string, alt: string, dim: number) => {
  return <img
    src={src}
    alt={alt}
    style={{
      width: `${dim}px`,
      height: `${dim}px`,
      borderRadius: '50%',
      marginRight: '8px',
    }}
  />
}