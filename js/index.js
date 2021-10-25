
/**
 * Store all of the dom elements
 * @var doms 
 */
let doms = {
    /**
     * Store all icon svgs
     * @var icons
     */
    icons: {
        // question mark icon svg
        questionMark: () => $(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"/></svg>`)
    },
    /**
     * store all of the meta data related elements
     * @var meta
     */
    meta: {
        /**
         * Get title meta element
         * @function title
         */
        title: () => $("title"),
    },
    progressView: {
        /**
         * Steps(progress) container that stores all of the progress nodes
         * @function container 
         */
        container: () => $(".progress-view"),

        /**
         * Get all steps elements 
         * @function all
         */
        all: () => $(".progress-view").children(".step")
    },
    questions: {
        /**
         * questions container that stores all questions
         * @function container
         */
        container: () => $(".sections-container"),

        /**
         * get all questions(jquery)
         * @function all
         */
        all: () => $("div.question")
    },
    //get main form element
    mainForm: () => $("#main-frm")
};

/**
 * Store all meta data informations
 * @var meta
 */
const meta = {
    /**
     * Page title
     * @var title
     */
    title: "Dummy questionnaire"
};

/**
 * Store all step numbers in the runtime
 * @var steps
 */
let steps = [];

/**
 * Map all of the step numbers to the relative label.
 * @var stepSlugs
 */
const stepSlugs = {
    1: null,
    2: "People in the Dwelling",
    3: "The Dwelling",
    4: "Animals",
    5: "Rating",
};

/**
 * Store all of the questions and answers
 * @var Qdata
 */
const Qdata = [
    /**
     * Question template
     *   
     * {
     *      "type": "number|string|select|date|sub-questions",
     *      "question": "The question?",
     *      "step": 1,
     *      "prev": (current) => {
     *          //handle this question's previous button click event
     *      },
     *      "next": (current) => {
     *          //handle this question's next button click event
     *      },
     *      
     *      //this can be an object or an array that contains many object like this
     *      "answer": { 
     *          "type": "number|string|select|date|sub-questions",
     *          "required": true,
     *          "name": "people_count", //value of name attribute that applied to the element
     *          
     *          //these properties are applied only if the type propertiy's value is number.
     *          "min": 0, //minmimum value
     *          "max":100 //maximum value
     *      }
     *},
     */

    {
        "type": "sub-questions",
        "question": "Address of the Dwelling?",
        "step": 1,
        "answer": [
            {
                "type": "string",
                "question": "Apartment Number",
                "name": "address_dwelling_apartment_number",
                "attributeName": "apartment number",
                "required": true,
            },
            {
                "type": "string",
                "question": "Street Number",
                "attributeName": "street number",
                "name": "address_dwelling_street_number",
                "required": true
            },
            {
                "type": "string",
                "question": "Street, Suburb/City",
                "attributeName": "street, suburb/city",
                "name": "address_dwelling_street_Suburb_City",
                "required": true
            },
            {
                "type": "string",
                "question": "State",
                "attributeName": "state",
                "name": "address_dwelling_state",
                "required": true
            },
            {
                "type": "string",
                "question": "Postcode",
                "attributeName": "postcode",
                "name": "address_dwelling_postcode",
                "required": true
            }
        ],
        "help": "Please fill all of the fileds. these fields are gethering details about address of the dwelling"
    },


    {
        "type": "number",
        "question": "How many people spent the census night at the dwelling??",
        "step": 2,
        "next": (current) => {
            //check wether the peoples count is positive
            if ($("input[name=people_count]").val() > 0) {
                //show the first itaration if the next repeatable question.
                methods.questions.putQuestion(Qdata[current], current + 1, 10, true).showQuestion();
            } else {
                //check that the next none reapeat question is available
                if (Qdata[current + 1] != undefined) { //there are many questions to show.
                    //show the next none repeat question
                    methods.questions.putQuestion(Qdata[current + 1], current + 2, 10, true).showQuestion();
                } else { // end of the form is detected.
                    //submit the form
                    doms.mainForm.submit();
                }

            }
        },
        "answer": {
            "type": "number",
            "required": true,
            "name": "people_count",
            "min": 0,
        }
    },
    {
        "type": "sub-questions",
        "question": "Person #{} details that stayed at the census night.",
        "step": 2,
        "repeat": true,
        "next": (current) => {
            //check wether the user defined number of pepoples data is acquired.
            if ($(`div.question[qnumber=${current}]`).length < $("input[name=people_count]").val()) {
                //itarate current repeatable question model again.
                methods.questions.putQuestion(Qdata[current - 1], current, 10, true)
                    .showQuestion();
            } else {
                //move to the next question.
                methods.questions.putQuestion(Qdata[current], current + 1, 10, true)
                    .showQuestion();
            }
        },
        "answer": [
            {
                "type": "string",
                "question": "Name",
                "required": true,
                "name": "name"
            },
            {
                "type": "string",
                "question": "Family Name",
                "required": true,
                "name": "family_name"
            },
            {
                "type": "select",
                "question": "Gender",
                "choises": ["Female", "Male"],
                "required": true,
                "name": "gender"
            },
            {
                "type": "date",
                "question": "Date of Birth",
                "required": true,
                "name": "date_of_birth"
            },
            {
                "type": "string",
                "question": "Country of Birth",
                "datalist": ["Australia", "New Zealand", "Fiji", "Solomon", "Islands", "Papua New Guinea", "Philippines"],
                "required": true,
                "name": "country_of_birth"
            },

            {
                "type": "number",
                "question": "In what year did you arrive in Australia?",
                "required": true,
                "name": "arrive_year",

                //accept last 170 years only
                "min": new Date().getFullYear() - 170, //
                "max": new Date().getFullYear(),

                MinimumError: "This field must be a valid year!",
                MaximumError: "This field must be a valid year before the current year!"
            },
            {
                "type": "select",
                "question": "Are you an Australian Citizen?",
                "choises": ["Yes", "No"],
                "required": true,
                "name": "is_citizen"
            },

            {
                "type": "string",
                "datalist": ["English Only", "Mandarin", "Italian", "Arabic", "Cantonese", "Greek"],
                "question": "Do you speak a Language other than English?",
                "required": true,
                "name": "speek_another_language"
            },
            {
                "type": "select",
                "question": "How well do you speak?",
                "choises": ["Very Well", "Well", "Not Well", "Not at All"],
                "required": true,
                "name": "speeks_well"
            },


            {
                "type": "select",
                "question": "What is the highest year of secondary school the person has completed?",
                "choises": ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Did not go to high school"],
                "required": true,
                "name": "highest_year_of_secondary_school"
            },

            {
                "type": "string",
                "question": "What is the highest qualification you have received?",
                "datalist": ["Trade Certificate", "Cert. I", "Cert. II", "Cert. III", "Cert. IV",
                    "Bachelor Degree", " Associate Diploma", "Diploma", "Masters",
                    "PhD"
                ],
                "required": true,
                "name": "highest_qualification"
            },

            {
                "type": "string",
                "question": "What is the main field of study of your Highest  Qualification?",
                "required": true,
                "name": "main_field_of_study"
            },
        ]
    },


    {
        "type": "string",
        "question": "Type of Dwelling?",
        "step": 3,
        "answer": {
            "name": "type_of_dwelling",
            "type": "string",
            "datalist": ["Detached House", "Semi-detached House",
                "Apartment", "Retirement village", "Caravan", "Houseboat", "Boat", "Tent"],
            "attributeName": "type of dwelling",
            "required": true,
        }
    },
    {
        "type": "string",
        "question": "Is this dwelling?",
        "step": 3,
        "answer": {
            "type": "string",
            "datalist": ["Owned outright", "Owned with Mortgage", "Rented",
                "Rent-free"],
            "name": "is_this_dwelling",
            "attributeName": "Is this dwelling",
            "required": true,
        }
    },
    {
        "type": "string",
        "question": "Sources of energy for the dwelling?",
        "step": 3,
        "answer": {
            "type": "string",
            "datalist": ["Mains electricity", "Photovoltaic",
                "Panels", "Battery", "Gas", "No power source"],
            "name": "sources_of_energy",
            "required": true,
        }
    },
    {
        "type": "select",
        "question": "Internet Access for the dwelling?",
        "step": 3,
        "answer": {
            "type": "select",
            "choises": ["Fibre to the house", "Fibre to the curb",
                "Fibre to the node", "Fixed wireless", "ADSL", "Mobile Broadband", "No Internet"
            ],
            "name": "internet_access",
            "required": true,
        }
    },
    {
        "type": "number",
        "question": "Average monthly internet download (in GB)?",
        "step": 3,
        "answer": {
            "type": "number",
            "name": "avg_monthly_internet_download",
            "required": true,
            "min": 0
        }
    },
    {
        "type": "number",
        "question": "How Many Bedrooms in the dwelling?",
        "step": 3,
        "answer": {
            "type": "number",
            "name": "bedroom_count",
            "required": true,
            "min": 0
        }
    },
    {
        "type": "select",
        "question": "Are there any electric vehicles garaged at the dwelling?",
        "step": 3,
        "next": (current) => {
            //check wether the user is definead the has_any_electric_vehicles question as yes.
            if ($("select[name=has_any_electric_vehicles]").val() == 1) {
                let hasMore = Qdata[current + 1] != undefined ? true : false;

                //show the next question 
                methods.questions.putQuestion(Qdata[current], current + 1, 10, hasMore)
                    .showQuestion();
            } else {
                let hasMore = Qdata[current + 2] != undefined ? true : false;
                //skip one question and show the next question
                methods.questions.putQuestion(Qdata[current + 1], current + 2, 10, hasMore)
                    .showQuestion();
            }
        },
        "answer": {
            "type": "select",
            "choises": ["Yes", "No"],
            "name": "has_any_electric_vehicles",
            "required": true,
        }
    },
    {
        "type": "select",
        "question": " What type of electric vehicle is garaged at the dwelling?",
        "step": 3,
        "answer": {
            "type": "select",
            "choises": ["Car", "Hybrid-car", "SUV", "Hybrid-SUV",
                "Truck", "Hybrid-truck", "Scooter", "Motorcycle"],
            "name": "what_type_of_electric_vehicle",
            "required": true,
        }
    },



    {
        "type": "number",
        "question": "How many types of animal on the census night were housed at or in association with the dwelling?",
        "step": 4,
        "next": (current) => {
            //check wether the user is enterd the positive number for animal_count question.
            if ($("input[name=animal_count]").val() > 0) {
                //show the first itration of the question
                methods.questions.putQuestion(Qdata[current], current + 1, 10, true).showQuestion();
            } else {
                //skip one question and goto next one
                methods.questions.putQuestion(Qdata[current + 1], current + 2, 10, true).showQuestion();
            }
        },
        "answer": {
            "type": "number",
            "name": "animal_count",
            "required": true,
            "min": 0
        }
    },
    {
        "type": "sub-questions",
        "step": 4,
        "question": "Animal type #{} details",
        "repeat": true,

        "next": (current) => {
            //check wether the number of current repeatable question is acquired
            if ($(`div.question[qnumber=${current}]`).length < $("input[name=animal_count]").val()) {
                let hasMore = Qdata[current + 1] != undefined ? true : false;
                hasMore |= $(`div.question[qnumber=${current}]`).length + 1 < $("input[name=animal_count]").val();

                //show new copy of the current question
                methods.questions.putQuestion(Qdata[current - 1], current, 10, hasMore)
                    .showQuestion();
            } else {
                let hasMore = Qdata[current + 1] != undefined ? true : false;

                //show the next question.
                methods.questions.putQuestion(Qdata[current], current + 1, 10, hasMore)
                    .showQuestion();
            }
        },
        "answer": [
            {
                "type": "string",
                "question": "What is the type of animal?",
                "required": true,
                "name": "type_of_animal"
            },
            {
                "type": "number",
                "question": "How many of this type of animal are present?",
                "required": true,
                "name": "type_of_animals_present",
                "min": 0
            },
        ]
    },


    {
        "type": "string",
        "question": "For possible follow-up questions please supply a contact phone-number or email address?",
        "step": 5,
        "answer": {
            "type": "string",
            "name": "phone_number_or_email_address",
            "required": true,
        }
    },
    {
        "type": "select",
        "question": "How difficult was this questionnaire to navigate?",
        "step": 5,
        "answer": {
            "type": "select",
            "choises": ["Very Hard",
                "Hard", "OK", "Easy", "Very Easy"
            ],
            "name": "difficulty_of_questionnaire",
            "required": true,
        }
    },
    {
        "type": "select",
        "question": "Where the input requirements of each question easy to follow?",
        "step": 5,
        "answer": {
            "type": "select",
            "choises": [
                "Very confusing", "Confusing", "OK", "Clear", "Very Clear"
            ],
            "name": "easy_to_follow",
            "required": true,
        }
    },
    {
        "type": "select",
        "question": "Did you need to use the Help?",
        "step": 5,
        "answer": {
            "type": "select",
            "choises": [
                "Very Often", "Often", "Occasionally", "Never"
            ],
            "name": "help_needed",
            "required": true,
        }
    },
    {
        "type": "select",
        "question": "Did you find the help useful?",
        "step": 5,
        "answer": {
            "type": "select",
            "name": "help_useful",
            "choises": [
                "Yes", "No", "Did not use it"
            ],
            "required": true,
        }
    },
    {
        "type": "string",
        "question": "Any other comments you would like to make?",
        "step": 5,
        "answer": {
            "type": "string",
            "name": "comments",
        }
    },
];

/**
 * Store all methods
 * @var methods
 */
let methods = {
    /**
     * Store all meta data related methods
     * @var meta
     */
    meta: {
        /**
         * Set the meta data values to the related meta elements
         * @param {*} meta_ 
         * @param {*} doms_ 
         */
        applyMetaData: function () {
            doms.meta.title().text(meta.title);
        }
    },
    /**
     * Store all methods related to the progress
     * @var steps
     */
    steps: {
        /**
         * Insert new step node
         * @param {*} step step number
         */
        putStep: function (step) {
            if (steps.includes(step)) return;

            steps.push(step);
            $(`<div class="step" step="${step}"><span>${step}</span></div>`)
                .appendTo(doms.progressView.container());
        },

        /**
         * Initilize the progress elements
         */
        initilizeSteps: () => {
            Qdata.forEach((q, i) => {
                methods.steps.putStep(q.step);
            });
        }
    },

    /**
     * Store all metods related to the questions
     */
    questions: {
        /**
         * Footer related methods
         * @var footer
         */
        footer: {
            /**
             * Create and insert the question footer for the given question
             * @param {*} questionContainer 
             * @param {*} questionNumber 
             * @param {*} hasAnyQuestions 
             */
            put: function (questionContainer, questionNumber, hasAnyQuestions) {
                //create the wrapper and insert it
                let wrapper = $("<div></div>")
                    .addClass("question-footer")
                    .appendTo(questionContainer);


                //create and insert the next and previous button container
                let directionBtns = $("<div></div>")
                    .addClass("direction-btns")
                    .appendTo(wrapper)

                //ignore first question
                if (questionNumber > 1) {

                    //create and insert previous button
                    $("<button></button>")
                        .attr("type", "button")
                        .text("Previous")
                        .on("click", e => {
                            //get all questions elements
                            let el = $(`div.question`);

                            //get the current questions
                            let curr = el.get(el.length - 1);

                            //get the previous question
                            let prev = el.get(el.length - 2);

                            //check wether the previous question is available
                            if (el.length - 1 > 0) {
                                $(prev).showQuestion();//show the previous question
                            }

                            $(curr).remove();//remove the current question
                        })
                        .appendTo(directionBtns);
                }


                if (hasAnyQuestions) { //there is more questions to show
                    //create and insert the next button
                    $("<button></button>")
                        .attr("type", "button")
                        .text("Next")
                        .on("click", e => {
                            //check wether the question is reapeatable
                            if (Qdata[questionNumber - 1].repeat) {
                                let lastQuestion = $(`div.question[qnumber=${questionNumber}]`).last();
                                //validate the repatable question
                                if (!methods.questions.validateQuestion(questionNumber, lastQuestion.attr("sub-qnumber"))) return;
                            } else {
                                //validate the question
                                if (!methods.questions.validateQuestion(questionNumber)) return;
                            }

                            //check wether the question has no custom next method
                            if (Qdata[questionNumber - 1].next == null) {
                                //show the next question
                                methods.questions.putQuestion(Qdata[questionNumber], questionNumber + 1, 10, Qdata[questionNumber + 1] != undefined)
                                    .showQuestion();
                            } else {
                                //exicute the custom next method
                                Qdata[questionNumber - 1].next(questionNumber);
                            }
                        })
                        .appendTo(directionBtns);
                } else { //end of the form is detected

                    //create and insert the finish button
                    $("<button></button>")
                        .text("Finish")
                        .attr("type", "button")
                        .on("click", e => {
                            //validate the answers
                            if (!methods.questions.validateQuestion(questionNumber)) return;

                            //submit the form
                            doms.mainForm().submit();
                        })
                        .appendTo(directionBtns);
                }
            }
        },
        /**
         * Answer related methods
         * @var answers
         */
        answers: {
            /**
             * Create given type of element
             * @param {*} type 
             * @param {*} parent 
             * @param {*} question 
             * @param {*} repeatQuestionNumber 
             * @returns 
             */
            put: (type, parent, question, repeatQuestionNumber = null) => methods.questions.answers[type].put(parent, question, repeatQuestionNumber),

            "sub-questions": {
                /**
                 * Create and insert question that is a subquesion of another question
                 * @param {*} parentContainer 
                 * @param {*} question 
                 * @param {*} repeatQuestionNumber 
                 */
                put: function (parentContainer, question, repeatQuestionNumber) {
                    question.answer.forEach(sq => {

                        //ignore if the ansewer type dosn't exist.
                        if (!methods.questions.answers[sq.type]) return;
                        methods.questions.answers[sq.type].put(parentContainer, sq, true, repeatQuestionNumber);
                    });
                }
            },
            "number": {
                /**
                 * Create and insert number field
                 * @param {*} parentContainer 
                 * @param {*} answer 
                 * @param {*} isSubQuestion 
                 * @param {*} repeatQuestionNumber 
                 */
                put: function (parentContainer, answer, isSubQuestion = false, repeatQuestionNumber) {
                    //check wether the question is a sub question of a another question.
                    if (!isSubQuestion) {
                        answer = answer.answer;
                    }
                    if (Array.isArray(answer)) {
                        //point the answer variable to the 
                        //first object in the array
                        answer = answer[0];
                    }

                    //create and insert the wrapper for the answer.
                    let wrapper = $("<div></div>")
                        .addClass("answer")
                        .appendTo(parentContainer);

                    //create and insert the field label
                    let label = $("<label></label>")
                        .addClass("answer-label")
                        .text(answer.question || "Your response")
                        .appendTo(wrapper)

                    //create and insert the input element
                    let input = $("<input/>")
                        .attr("type", "number")
                        .appendTo(wrapper);

                    if (repeatQuestionNumber != null) {
                        //set the attribites of the repatable question
                        label
                            .attr("for", `${answer.name}-${repeatQuestionNumber}`)
                        input
                            .attr("name", `${answer.name}_${repeatQuestionNumber}`)
                            .attr("id", `${answer.name}-${repeatQuestionNumber}`)
                    } else {
                        //set the attribites of the question
                        label
                            .attr("for", answer.name)
                        input
                            .attr("name", answer.name)
                            .attr("id", answer.name)
                    }

                    //set the max limit if present
                    if (answer.max != null) {
                        input.attr("data-max", answer.max);
                    }
                    //set the min limit if present
                    if (answer.min != null) {
                        input.attr("data-min", answer.min);
                    }
                    //set the min limit error if present
                    if (answer.MinimumError) {
                        input.attr("data-c-min-error", answer.MinimumError)
                    }
                    //set the max limit error if present
                    if (answer.MaximumError) {
                        input.attr("data-c-max-error", answer.MaximumError)
                    }
                },
                /**
                 * Validate the number field
                 * @param {*} element 
                 * @param {*} label 
                 * @param {*} required 
                 * @returns 
                 */
                validate: function (element, label, required) {
                    let hasErrors = false;
                    //get the field's value
                    let value = element.val() || "";

                    //check wether the field is requred
                    if (required) {

                        if (isNaN(value.trim()) || value.trim().length < 1) { //field's value is not valid
                            hasErrors |= true;

                            //show error message
                            if (label == null) {
                                methods.questions.validationError(element, `This field is missing/invalid!`);
                            } else {
                                methods.questions.validationError(element, `The ${label} field is missing/invalid!`);
                            }
                        } else {//field is valid

                            //clear field's errors
                            methods.questions.validationError(element, null);
                        }
                    }
                    if (hasErrors) return !hasErrors;

                    if (isNaN(value.trim()) && value.trim().length > 0) return false;

                    //get the min limit
                    let min = element.attr("data-min");
                    //get the max limit
                    let max = element.attr("data-max");
                    if (min != null) {
                        if (value >= min) {//minimum limit is ok

                            //remove previous errors
                            methods.questions.validationError(element, null);
                        } else {//minimum limit is not ok
                            hasErrors |= true;

                            //show error message

                            if (element.attr("data-c-min-error") != null) {//check wether there are custom error messages defined
                                methods.questions.validationError(element, element.attr("data-c-min-error"));
                            } else {//no custom error messages defined

                                //show the default error messages
                                if (label == null) {
                                    methods.questions.validationError(element, `This field must be at least ${min}!`);
                                } else {
                                    methods.questions.validationError(element, `The ${label} field must be at least ${min}!`);
                                }
                            }
                        }
                    }

                    if (hasErrors) return !hasErrors;

                    if (max != null) {
                        if (value <= max) { //maximum limit is ok
                            methods.questions.validationError(element, null);
                        } else {
                            hasErrors |= true;

                            //show error message

                            if (element.attr("data-c-max-error") != null) {//check wether there are custom error messages defined
                                methods.questions.validationError(element, element.attr("data-c-max-error"));
                            } else {//no custom error messages defined
                                //show the default error messages
                                if (label == null) {
                                    methods.questions.validationError(element, `This field must be less than ${max}!`);
                                } else {
                                    methods.questions.validationError(element, `The ${label} field must be less than ${max}!`);
                                }
                            }
                        }
                    }
                    return !hasErrors;

                }
            },
            "string": {
                /**
                 * Create and insert string field
                 * @param {*} parentContainer 
                 * @param {*} answer 
                 * @param {*} isSubQuestion 
                 * @param {*} repeatQuestionNumber 
                 */
                put: function (parentContainer, answer, isSubQuestion = false, repeatQuestionNumber) {
                    //check wether the question is a sub question of a another question.
                    if (!isSubQuestion) {
                        answer = answer.answer;
                    }
                    if (Array.isArray(answer)) {
                        //point the answer variable to the 
                        //first object in the array
                        answer = answer[0];
                    }

                    //create and insert the wrapper for the answer.
                    let wrapper = $("<div></div>")
                        .addClass("answer")
                        .appendTo(parentContainer);

                    //create and insert the field label
                    let label = $("<label></label>")
                        .addClass("answer-label")
                        .text(answer.question || "Your response")
                        .appendTo(wrapper)


                    //create and insert the input element
                    let input = $("<input/>")
                        .attr("type", "text")
                        .appendTo(wrapper);

                    if (repeatQuestionNumber != null) {
                        //set the attribites of the repatable question
                        label
                            .attr("for", `${answer.name}-${repeatQuestionNumber}`)
                        input
                            .attr("id", `${answer.name}-${repeatQuestionNumber}`)
                            .attr("name", `${answer.name}_${repeatQuestionNumber}`)
                    } else {
                        //set the attribites of the question
                        label
                            .attr("for", answer.name);

                        input
                            .attr("id", answer.name)
                            .attr("name", answer.name)
                    }


                    if (answer.datalist != null) {
                        let datalist = $("<datalist>")
                            .attr("id", `data-list-${answer.name}`)
                            .appendTo(wrapper);

                        input.attr("list", `data-list-${answer.name}`);
                        answer.datalist.forEach(dli => {
                            $("<option></option>")
                                .attr("value", dli)
                                .appendTo(datalist);
                        });
                    }
                },
                /**
                 * Validate the dropdown field
                 * @param {*} element 
                 * @param {*} label 
                 * @param {*} required 
                 * @returns 
                 */
                validate: function (element, label, required) {
                    let hasErrors = false;
                    let value = element.val(); //get the field value

                    //check wether the field is required 
                    if (required) {
                        if ((value || "").trim().length < 1) { //the field value is not valid
                            hasErrors |= true;
                            if (label == null) {
                                methods.questions.validationError(element, `This field is missing/invalid!`);
                            } else {
                                methods.questions.validationError(element, `The ${label} field is missing/invalid!`);
                            }
                        } else {//the field is valid

                            //clear the field errors
                            methods.questions.validationError(element, null);
                        }
                    }

                    return !hasErrors;

                }
            },
            "select": {
                /**
                 * Create and insert dropdown field
                 * @param {*} parentContainer 
                 * @param {*} answer 
                 * @param {*} isSubQuestion 
                 * @param {*} repeatQuestionNumber 
                 */
                put: function (parentContainer, answer, isSubQuestion = false, repeatQuestionNumber) {
                    //check wether the question is a sub question of a another question.
                    if (!isSubQuestion) {
                        answer = answer.answer;
                    }

                    if (Array.isArray(answer)) {
                        //point the answer variable to the 
                        //first object in the array
                        answer = answer[0];
                    }

                    //create and insert the wrapper for the answer.
                    let wrapper = $("<div></div>")
                        .addClass("answer")
                        .appendTo(parentContainer);

                    //create and insert the field label
                    let label = $("<label></label>")
                        .addClass("answer-label")
                        .text(answer.question || "Your response")
                        .appendTo(wrapper)

                    //create and insert the select element
                    let select = $("<select></select>")
                        .appendTo(wrapper)

                    if (repeatQuestionNumber != null) {
                        //set the attribites of the repatable question
                        label
                            .attr("for", `${answer.name}-${repeatQuestionNumber}`)

                        select
                            .attr("name", `${answer.name}_${repeatQuestionNumber}`)
                            .attr("id", `${answer.name}-${repeatQuestionNumber}`)

                    } else {
                        //set the attribites of the question
                        label
                            .attr("for", answer.name);

                        select
                            .attr("name", answer.name)
                            .attr("id", answer.name)
                    }

                    //add dropdown items
                    answer.choises.forEach((ch, i) => {
                        $("<option></option>")
                            .text(ch)
                            .attr("value", i + 1)
                            .appendTo(select)
                    });

                },
                /**
                 * Validate the dropdown field
                 * @param {*} element 
                 * @param {*} label 
                 * @param {*} required 
                 * @returns 
                 */
                validate: function (element, label, required) {
                    let hasErrors = false;
                    let value = element.val(); //get the selected dropdown value

                    //check wether the field is required
                    if (required) {
                        //check wether the user is selected a dropdown item
                        if ((value || "").trim().length < 1) {//selected dropdown item is not valid
                            hasErrors |= true;

                            //show error message for the field
                            if (label == null) {
                                methods.questions.validationError(element, `This field is missing/invalid!`);
                            } else {
                                methods.questions.validationError(element, `The ${label} field is missing/invalid!`);
                            }
                        } else { //selected dropdown item is valid
                            //clear the field errors
                            methods.questions.validationError(element, null);
                        }
                    }
                    return !hasErrors;

                }
            },
            "date": {
                /**
                 * Create and insert a date field
                 * @param {*} parentContainer 
                 * @param {*} answer 
                 * @param {*} isSubQuestion 
                 * @param {*} repeatQuestionNumber 
                 */
                put: function (parentContainer, answer, isSubQuestion = false, repeatQuestionNumber) {
                    //check wether the question is a sub question of a another question.
                    if (!isSubQuestion) {
                        answer = answer.answer;
                    }

                    if (Array.isArray(answer)) {
                        //point the answer variable to the 
                        //first object in the array
                        answer = answer[0];
                    }

                    //create and insert the wrapper for the answer.
                    let wrapper = $("<div></div>")
                        .addClass("answer")
                        .appendTo(parentContainer);

                    //create and insert the field label
                    let label = $("<label></label>")
                        .addClass("answer-label")
                        .text(answer.question || "Your response")
                        .appendTo(wrapper)

                    //create and insert the field input
                    let input = $("<input/>")
                        .attr("type", "date")
                        .attr("name", answer.name)
                        .appendTo(wrapper)

                    if (repeatQuestionNumber != null) {
                        //set the attribites of the repatable question
                        label
                            .attr("for", `${answer.name}-${repeatQuestionNumber}`);

                        input
                            .attr("name", `${answer.name}_${repeatQuestionNumber}`)
                            .attr("id", `${answer.name}-${repeatQuestionNumber}`);
                    } else {
                        //set the attribites of the question
                        label
                            .attr("for", answer.name);

                        input
                            .attr("name", answer.name)
                            .attr("id", answer.name)
                    }
                },

                /**
                 * Validate the date field
                 * @param {*} element 
                 * @param {*} label 
                 * @param {*} required 
                 * @returns {boolean} wether the field is valid or not
                 */
                validate: function (element, label, required) {
                    let hasErrors = false;
                    let value = element.val(); //get the field value.

                    //check wether the field is required
                    if (required) {

                        //check that the value is not null
                        if (value.trim().length < 1) { //field is not valid
                            hasErrors |= true;

                            //show error message for the field
                            if (label == null) {
                                methods.questions.validationError(element, `This field is missing/invalid!`);
                            } else {
                                methods.questions.validationError(element, `The ${label} field is missing/invalid!`);
                            }
                        } else {//field is valid
                            //remove all error messages
                            methods.questions.validationError(element, null);
                        }
                    }
                    return !hasErrors;

                }
            },
        },

        /**
         * Put given question to the question container
         * @param {*} question 
         * @param {*} questionNumber 
         * @param {*} totalQuestionCount 
         * @param {*} hasAny 
         * @returns 
         */
        putQuestion: function (question, questionNumber, totalQuestionCount, hasAny) {
            //create the question wrapper element
            let wrapper = $("<div></div>")
                .addClass("question")
                .attr("qnumber", questionNumber)
                .attr("step", question.step)
                .attr("type", question.type);

            //check wether the question is repatable
            if (Qdata[questionNumber - 1].repeat) {
                //set the sub question number to the wrapper
                wrapper.attr("sub-qnumber", $(`div.question[qnumber=${questionNumber}]`).length + 1)
            }

            //create the section header.
            
            let sectionHeadingContainer = $("<div></div>")
            .addClass("section-heading-container")
                .appendTo(wrapper);
            
            let sectionHeader = $("<div></div>")
                .addClass("section-header")
                .appendTo(sectionHeadingContainer);

            //create and append the step heading
            $("<h2></h2>")
                .text(`Step ${question.step} ${stepSlugs[question.step] != null ? " - " + stepSlugs[question.step] : ""}`)
                .appendTo(sectionHeader);



            let repeatQuestionNumber = null;
            //check wether the question is repatable
            if (Qdata[questionNumber - 1].repeat) {
                repeatQuestionNumber = $(`div.question[qnumber=${questionNumber}]`).length + 1;

                //prepire the question text
                questionText = question.question || "";
                if (questionText != null) {
                    //set the repatable number
                    questionText = questionText.format(repeatQuestionNumber);
                }

                //create and add thje question element
                $("<p></p>")
                    .addClass("question")
                    .text(`${$(`div.question`).length + 1}. ${questionText}`)
                    .appendTo(wrapper);

            } else {
                //create and add the question element
                questionParagraph = $("<p></p>")
                    .addClass("question")
                    .text(`${$(`div.question`).length + 1}. ${question.question || ""}`)
                    .appendTo(wrapper);

            }
            if (question.help != null) {
                sectionHeadingContainer
                    .addClass("help-available");

                let helpBtn = $("<div></div>")
                    .addClass("help-toggler-btn")
                    .append(doms.icons.questionMark())
                    .appendTo(sectionHeadingContainer)



                let helpContainer = $("<div></div>")
                    .addClass("help-container")
                    .append()
                    .hide()
                    .appendTo(wrapper)

                doms.icons.questionMark()
                    .appendTo(helpContainer);
                $("<p></p>")
                    .addClass("question")
                    .text(question.help)
                    .appendTo(helpContainer);
                
                helpBtn.on("click", function () {
                    helpContainer.slideToggle(250);
                });
            }

            //add answers
            methods.questions.answers.put(question.type, wrapper, question, repeatQuestionNumber);

            //add footer
            methods.questions.footer.put(wrapper, questionNumber, hasAny);

            //append the question wrapper to the questions container
            wrapper.appendTo(doms.questions.container());

            return wrapper;
        },

        /**
         * Show or clear the given input element's error message
         * @param {*} inputElement 
         * @param {*} message 
         */
        validationError: function (inputElement, message) {
            //get the related error message element if exists
            let errorEl = inputElement.parent().find(`[name=error-${inputElement.attr("name")}]`);
          
            if (message == null) {
                errorEl.remove(); //remove the element
                inputElement.removeClass("invalid-input");
            } else {
                if (errorEl.length < 1) {
                    inputElement.addClass("invalid-input");
                    //create and append the error message element
                    $("<span></span>")
                        .attr("name", `error-${inputElement.attr("name")}`)
                        .text(message)
                        .addClass("input-error")
                        .appendTo(inputElement.parent());
                } else {
                    errorEl.text(message) //update the exisiting error message element
                }
            }


        },

        /**
         * Check wether the given question is valid
         * @param {*} questionNumber 
         * @param {*} repeatQuestionNumber 
         * @returns 
         */
        validateQuestion: function (questionNumber, repeatQuestionNumber = null) {
            //get the question's answer object
            let answer = Qdata[questionNumber - 1].answer;

            //get the question's element
            let wrapper = this.getQuestionDomByNumber(questionNumber);


            let hasErrors = false;

            //check wether the answer is an array
            if (Array.isArray(answer)) {
                Qdata[questionNumber - 1].answer.forEach(answer => {
                    let element = null;
                    if (repeatQuestionNumber != null) {
                        //get the current repatable question's answer input element.
                        element = wrapper.find(`[name=${answer.name}_${repeatQuestionNumber}]`);
                    } else {
                        //get the current answer's input element.
                        element = wrapper.find(`[name=${answer.name}]`);
                    }

                    hasErrors |= !methods.questions.answers[answer.type].validate(element, answer.attributeName || null, answer.required);
                });
            } else {
                let element = null;
                if (repeatQuestionNumber != null) {
                    //get the current repatable question's answer input element.
                    element = wrapper.find(`[name=${answer.name}_${repeatQuestionNumber}]`);
                } else {
                    //get the current answer's input element.
                    element = wrapper.find(`[name=${answer.name}]`);
                }

                hasErrors |= !methods.questions.answers[answer.type].validate(element, answer.attributeName || null, answer.required);
            }
            return !hasErrors;
        },

        /**
         * Get the question's dom element
         * @param {*} number 
         * @returns 
         */
        getQuestionDomByNumber: function (number) {
            return doms.questions.all().filter((i, el) => {
                return $(el).attr("qnumber") == number;
            });
        },
    }
};


/**
 * Show the given question element and hidel all others
 */
$.fn.showQuestion = function () {
    //hide all questions
    doms.questions.all().removeAttr("show");

    //show this question
    this.attr("show", true);

    //update the progress elements data
    doms.progressView.all()
        .removeAttr("current")
        .removeAttr("finished");

    doms.progressView.all().each((i, el) => {
        if ($(el).attr("step") < this.attr("step")) {
            $(el).attr("finished", true);
        }
        else if ($(el).attr("step") == this.attr("step")) {
            $(el).attr("current", true);
        }
    })

}

/**
 * Stop submiting the form when enter keypress
 */
$("form").bind("keypress", function (e) {
    if (e.keyCode == 13) {
        return false;
    }
});

/**
 * Custom string formating
 * @returns formated string
 * 
 * @example "{}, {}".format(1, 2); -> Output:"1, 2"
 */
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

$(() => {
    //apply meta data
    methods.meta.applyMetaData();

    //initilize the progress elements
    methods.steps.initilizeSteps();

    //show the first question
    methods.questions.putQuestion(Qdata[0], 1, 10, true).showQuestion();
});

