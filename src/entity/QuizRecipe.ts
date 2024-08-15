export default class QuizRecipe {
    public temperature: string = '';
    public items: {
        id: number,
        title: string,
        amount: string
    }[] = []

    public submit(answers: { title: string; amount: string }[]): {
        isCorrect: boolean
        message: string,
        wrongAnswers: { title: string; amount: string }[]
    } {
        if (this.items.length !== answers.length) {
            return {
                isCorrect: false,
                message: '정답의 레시피 개수가 일치하지 않습니다!',
                wrongAnswers: []
            }
        }

        const wrongAnswers = this.items.filter((item, index) => {
            const answer = answers[index];
            return item.title !== answer.title || item.amount !== answer.amount;
        });

        if (wrongAnswers.length === 0) {
            return {
                isCorrect: true,
                message: '',
                wrongAnswers: []
            };
        } else {
            return {
                isCorrect: false,
                message: '정답과 일치하지 않는 레시피가 있습니다.',
                wrongAnswers: wrongAnswers
            }
        }
    }
};