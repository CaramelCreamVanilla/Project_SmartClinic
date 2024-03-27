const pool = require('../db.js')

//add new question
const createQuestion = async (req, res) =>{
    const { question ,answerForm } = req.body;
    // console.log(answerForm)
    const strAnswerForm = JSON.stringify(answerForm)
    pool.query('INSERT INTO question_answer (question,answer) VALUES (?, ?)' ,[question,strAnswerForm] ,(error,results)=>{
      if (error) {
        console.error('Error adding question :', error);
        return res.status(500).json({ error: 'Error adding user info' });
      }
      return res.json({ success: true, message: 'Question added successfully',q_row:results.insertId});
    })
}

//update question
const updateQuestion = async (req,res)=>{
  const { question ,answerForm ,q_id} = req.body
  const strAnswerForm = JSON.stringify(answerForm)

  const sqlUpdate = 'UPDATE question_answer SET question = ?, answer = ? WHERE q_id = ?';

  pool.query(sqlUpdate, [question, strAnswerForm, q_id], (error, results) => {
    if (error) {
      console.error('Error updating question:', error);
      return res.status(500).json({ error: 'Error updating question' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Question not found or no change in data' });
    }

    return res.json({ success: true, message: 'Question updated successfully', q_row: q_id });
  });
}

//delete question
const deleteQuestion = (req,res) =>{
  const q_id = parseInt(req.params.id)

  pool.query('DELETE FROM question_answer WHERE q_id = ?', [q_id],(error, results) =>{
    if (error) {
      return res.status(500).send(error.message);
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Question not found" });
    } else {
      return res.status(204).send();
    }  
  })
}

const getQuestion = async (req , res) =>{
  try{
    const [rows] = await pool.promise().query('SELECT * FROM `question_answer`')
    if (rows.length === 0) {
      res.status(404).json({ error: 'No case found' });
    }else{
      res.status(201).json(rows); 
    }
  }catch(error){
    return res.status(500).send(error.message);
  }
}

module.exports = {
    createQuestion , getQuestion , updateQuestion ,deleteQuestion
}