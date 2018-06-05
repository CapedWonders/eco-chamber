
const formatDataForGameResults = (score) =>  {
    
  const data = {
    labels: ['Left', 'Center', 'Right'],
    datasets: [
      {
        label: 'Correct',
        backgroundColor: 'rgba(0, 128, 128, 0.2)',
        borderColor: 'rgba(0, 128, 228 ,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(0, 128, 128, 0.4)',
        hoverBorderColor: 'rgba(0, 128, 128, 1)',
        data: [score.left.correct, score.center.correct, score.right.correct]
      },
       {
        label: 'Incorrect',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(0, 0, 0, 0.4)',
        hoverBorderColor: 'rgba(0, 0, 0, 1)',
        data: [score.left.incorrect, score.center.incorrect, score.right.incorrect]
      }
    ]
  }
  return data;
};

export default formatDataForGameResults;


