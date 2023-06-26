export default function AddReports({
  setTitle,
  setView,
  isMonitized,
  setMonitized,
  submit,
}) {
  return (
    <>
      <input
        placeholder="Title Here..."
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <input
        placeholder="Views Here..."
        type="number"
        onChange={(e) => setView(e.target.value)}
      ></input>
      <input
        type="checkbox"
        checked={isMonitized}
        onChange={(e) => setMonitized(e.target.checked)}
      ></input>
      <label>Monitized</label>
      <button onClick={submit}>Submit Report</button>
    </>
  );
}
