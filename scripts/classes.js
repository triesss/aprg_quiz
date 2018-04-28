class User {
    constructor() {

    }
}

class Question {
    constructor(id) {
        if (typeof(id)==='string') {
            //erstelle neue Frage
            this.question = id;
        } else if (typeof(id)==='number') {
            //hol Frage aus DB
            this.id = id;
            this.question = this.questionFromDb();
            //Array of Answers
            this.answers = new Answer(id);
        }
    }
    get questionFromDb(){
        //select question from question where id = $id;
    }
    get question(){
        return this.question;
    }
    get answers(){
        return this.answers;
    }
}

class Answer {
    constructor(id) {
        //wenn answerFromDb Array liefert
        this.answer = this.answerFromDb()[0];
        this.isTrue = this.answerFromDb()[1];
    }
    get answerFromDb(){
        //select answer, is_true from answer where qid = $id;
    }
    get answer(){
        return this.answer;
    }
    isTrue(){
        return this.isTrue;
    }
}

class GameSession {
    constructor() {

    }
}

class UserStatistic {
    constructor() {

    }
}
