angular.module('TKServicesModule', [])
    .service('TKQuestionsService', ["$translate", function($translate) {
        var service = this;
        var questions = [];
        service.setQuestions = function(serverQuestions) {
            questions = serverQuestions;
        };
        service.getQuestion = function(questionID) {
            var results = [];
            questions.forEach(function(question) {
                //Search for questions with the specified question ID


                if (question.Question_Number == questionID) {


                    var newQuestion1 = {};
                    newQuestion1.Question_Number = question.Question_Number;
                    newQuestion1.Answer_ID = question.Answer_ID;
                    newQuestion1.Style = question.Style;
                    newQuestion1.id = question.id;





                    if (typeof navigator.globalization !== "undefined") {
                        navigator.globalization.getPreferredLanguage(function(language) {

                            var setLanguage = language.value;
                            newQuestion1.Text = question["Text_" + setLanguage.split("-")[0]];



                        }, null);
                        results.push(newQuestion1);
                    }
                    else {

                        var newQuestion2 = {};
                        newQuestion2.Question_Number = question.Question_Number;
                        newQuestion2.Answer_ID = question.Answer_ID;
                        newQuestion2.Style = question.Style;
                        newQuestion2.id = question.id;
                        newQuestion2.Text = question["Text_" + $translate.use()];



                        //Search for questions with the specified question ID

                        results.push(newQuestion2);

                    }





                }

            });
            return results;
        };
        service.questionsLength = function() {
            return questions.length;
        };
    }])
    .service("TKAnswersService", function() {
        var service = this;
        var answerCategories = {

            "competing": 0,
            "collaborating": 0,
            "compromising": 0,
            "avoiding": 0,
            "accommodating": 0,

        };
        var answers = {};

        var lastQuestionNumber = 0;
        var categoriesStack = [];

        service.saveAnswer = function(questionNumber, answerCategory, option) {
            answerCategories[answerCategory.toLowerCase()]++;
            answers[questionNumber] = option;
            categoriesStack.push(answerCategory);
        };

        service.getAnswers = function() {
            return answerCategories;
        };

        service.setAnswers = function(answers) {
            answerCategories = answers;
        };
        service.resetAnswers = function() {
            for (var property in answerCategories) {
                if (answerCategories.hasOwnProperty(property)) {
                    answerCategories[property] = 0;
                    lastQuestionNumber = 0;
                }
            }
        };

        service.setLastQuestionNumber = function(qNumber) {
            lastQuestionNumber = qNumber;
        };

        service.getLastQuestionNumber = function() {
            return lastQuestionNumber;
        };

        service.eraseLastAnswer = function() {
            answerCategories[categoriesStack.pop().toLowerCase()]--;
        };


    })
    .service('TKResultsButtonService', function() {
        var service = this;

        var shouldShowButton = false;

        service.setShouldShowMenuButton = function(show) {
            shouldShowButton = show;
        };

        service.getShouldShowMenuButton = function() {
            return shouldShowButton;
        };
    });
