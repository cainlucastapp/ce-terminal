// client/src/components/attendees/AttendeeSearch.jsx

export function AttendeeSearch({ value, onChange }) {
  return (
    <div className="attendee-search">
      <label htmlFor="attendee-search">Search Attendees</label>
      <div className="attendee-search-row">
        <input
          id="attendee-search"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by Name, License Number, or Date"
        />
        <button type="button" onClick={() => onChange('')}>
          Clear
        </button>
      </div>
    </div>
  )
}
