function Overview({ stats, messages, formatDate }) {
  return (
    <section className="panel-grid">
      {stats.map((stat) => (
        <article className="stat" key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </article>
      ))}

      <article className="panel panel-wide">
        <h3>Recent Messages</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Sent</th>
              </tr>
            </thead>
            <tbody>
              {messages.slice(0, 6).map((row) => (
                <tr key={row.messageID}>
                  <td>{row.firstName} {row.lastName}</td>
                  <td>{row.email}</td>
                  <td>{row.status}</td>
                  <td>{formatDate(row.sentAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default Overview;
