export default class Interviewer {
  constructor(options) {
    this.options = options;

    this.questions = [];
    this.answers = {};
  }

  ask(key, question) {
    const value = this.options[key];

    if (value === undefined) {
      this.questions.push(question);
    } else {
      this.answers[key] = value;
    }
  }

  prompt(generator) {
    return new Promise(resolve => {
      const done = generator.async();

      generator.prompt(this.questions, answers => {
        done();
        resolve({...this.answers, ...answers});
      });
    });
  }
}
