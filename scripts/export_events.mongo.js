use javatutor
var experiments = {'': 'UNKNOWN'}
db.Experiments.find().forEach(({_id, title})=>{
  experiments[_id]=title
})
var students = {'': 'UNKNOWN'}
var student_experiments = {'': 'UNKNOWN'}
db.Students.find().forEach(({_id, nickname, experiment_id})=>{
  students[_id]=nickname
  student_experiments[_id]=experiments[experiment_id]
})
Object.keys(students).map(student_id => 
  db.Events.find({student_id}).map(({createdAt, student_id, task_id, type, value, code}) => 
    [
      student_experiments[student_id||'']||'',
      createdAt ? new Date(createdAt.getTime() + 3*60*60*1000).toTimeString().substr(0, 8) : '',
      students[student_id||'']||'',
      task_id||'',
      type||'',
      value||'',
      code||''
    ]
     .map(JSON.stringify).join(', ').replace(/\\n/g, '\n')).join("\n")
).join('\n')
