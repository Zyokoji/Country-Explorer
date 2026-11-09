function CountryCard({ country }) {
  const { names, flag, region, capitals, population } = country

  return (
    <article className="card">
      {flag.url_png ? (
        <img src={flag.url_png} alt={flag.description || `Flag of ${names.common}`} />
      ) : (
        <div className="flag-emoji">{flag.emoji || '🏳️'}</div>
      )}
      <div className="card-body">
        <h2>{names.common}</h2>
        <p><strong>Region:</strong> {region}</p>
        <p><strong>Capital:</strong> {capitals[0]?.name ?? 'N/A'}</p>
        <p><strong>Population:</strong> {population.toLocaleString()}</p>
      </div>
    </article>
  )
}

export default CountryCard
