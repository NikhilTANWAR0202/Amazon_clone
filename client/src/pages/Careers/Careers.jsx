
const roles = [
  {id:'frontend',title:'Frontend Developer'},
  {id:'backend',title:'Backend Developer'},
  {id:'ui',title:'UI Designer'},
  {id:'qa',title:'QA Engineer'},
]

export default function Careers(){
  return (
    <div className="container">
      <h2>Careers</h2>
      {roles.map(r=> (
        <div key={r.id} style={{background:'var(--cards)',padding:12,borderRadius:8,marginBottom:8}}>
          <h3>{r.title}</h3>
          <p>Apply for {r.title} role.</p>
          <button className="btn">Apply</button>
        </div>
      ))}
    </div>
  )
}
