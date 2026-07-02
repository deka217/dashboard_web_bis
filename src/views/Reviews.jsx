function Reviews({ reviews, formatDate }) {
  return (
    <article className="panel">
      <h3>Product Reviews</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Review ID</th>
              <th>User ID</th>
              <th>Product ID</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((row) => (
              <tr key={row.reviewID}>
                <td>{row.reviewID}</td>
                <td>{row.userID}</td>
                <td>{row.productID}</td>
                <td>{row.rating ?? "-"}</td>
                <td>{row.reviewText || "-"}</td>
                <td>{formatDate(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default Reviews;
