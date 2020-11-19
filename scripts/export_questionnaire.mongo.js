use javatutor
var experiments = {'': 'UNKNOWN'}
db.Experiments.find().forEach(({_id, title})=>{
  experiments[_id]=title
})
var students = {'': 'UNKNOWN'}
var student_experiments = {'': 'UNKNOWN'}
var student_groups = {'': 'UNKNOWN'}
db.Students.find().forEach(({_id, nickname, experiment_id, group})=>{
  students[_id]=nickname
  student_experiments[_id]=experiments[experiment_id]
  student_groups[_id]=group
})
Object.keys(students).map(student_id => 
  db.Events.find({student_id, type: 'Questionnaire'}).map(({value, student_id}) => {
    value = JSON.parse(value)
    return [
      student_experiments[student_id||'']||'',
      students[student_id||'']||'',
      student_groups[student_id||'']||'',
      value["enjoyed"],
      value["instructors-help-useful"],
      value["hints-useful"],
      value["easy-to-solve"],
      value["easy-to-understand"],
      value["other"]
    ].map(JSON.stringify).join(', ').replace(/\\n/g, '\n')
  }).join("\n")
).filter(Boolean).join('\n')
