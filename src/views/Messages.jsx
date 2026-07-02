import { Trash2 } from "lucide-react";

function Messages({ messages, onChangeMessageStatus, onDeleteMessage, formatDate }) {
  return (
    <article className="panel">
      <h3>Message Inbox</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Status</th>
              <th>Sent</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {messages.map((row) => (
              <tr key={row.messageID}>
                <td>{row.firstName} {row.lastName}</td>
                <td>{row.email}</td>
                <td>{row.phoneNumber || "-"}</td>
                <td>{row.message}</td>
                <td>
                  <select
                    value={row.status || "unread"}
                    onChange={(event) => onChangeMessageStatus(row.messageID, event.target.value)}
                  >
                    <option value="unread">unread</option>
                    <option value="read">read</option>
                    <option value="replied">replied</option>
                  </select>
                </td>
                <td>{formatDate(row.sentAt)}</td>
                <td className="row-actions">
                  <button
                    className="icon-btn danger"
                    type="button"
                    title="Delete Message"
                    onClick={() => onDeleteMessage(row.messageID)}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export default Messages;
