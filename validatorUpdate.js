class Validator{
    constructor(selector){
        this.formSelector = selector.formSelector;
        this.formGroupSelector = selector.formGroupSelector;
        this.errorSelector = selector.errorSelector;
        this.formRules = this.validtor();
    }
    validtor(){
        var formRules = {};
        var validatorRules = {
            required(value){
                return value.trim() ? undefined : "Trường này chưa được nhập!";
            },
            email(value){
                let regex = /^[\w]+@gmail\.com$/;
                return regex.test(value) ? undefined : "Trường email không hợp lệ!";
            },
            min(min){
                return (value)=>{
                    let regex = new RegExp(`(?=.*\\d)(?=.*[\\W])(?!.*\\s)(?=.*[a-z])(?=.*[A-Z])(?=.{${min},})`);
                    return regex.test(value) ? undefined : `Trường mật khẩu ít hơn ${min} ký tự!`;
                }
            },
            max(max){
                return (value)=>{
                    let regex = new RegExp(`(?=.*\\d)(?=.*[\\W])(?!.*\\s)(?=.*[a-z])(?=.*[A-Z])(?=.{1,${max}})`);
                    return regex.test(value) ? undefined : `Trường mật khẩu nhiều hơn ${max} ký tự!`;
                }
            }
        };
        var formElement = document.querySelector(this.formSelector);
        if(formElement){
            var inputs = formElement.querySelectorAll("[name][rules]");
            for(var input of inputs){
                
                var rules = input.getAttribute("rules").split("|");
                for(var rule of rules){
                    var isRuleHasValue = rule.includes(":");
                    var ruleFunc;
                    if(isRuleHasValue){
                        var ruleInfor = rule.split(":");
                        rule = ruleInfor[0];
                        ruleFunc = validatorRules[rule](ruleInfor[1]);
                    }else{
                        ruleFunc = validatorRules[rule];
                    }
                    if(Array.isArray(formRules[input.name])){
                        formRules[input.name].push(ruleFunc);
                    }else{
                        formRules[input.name] = [ruleFunc];
                    }
                }
                /**
                 * Lợi ích của bind() tạo hàm mới kế thừa hàm được chấm đối số đầu tiên
                 * của bind() sẽ là this của hàm mới và các đối số theo sau sẽ là đối số
                 * của hàm mới.
                 */
                input.onblur = this.handleValidate.bind(this);
                input.oninput = this.handleClearError.bind(this);
            }
        }
        return formRules;
    }
    onSubmit(){
        var _this = this;
        var formElement = document.querySelector(_this.formSelector);
        formElement.onsubmit = function(event){
            event.preventDefault();
            var inputs = formElement.querySelectorAll("[name][rules]");
            var isValid = true;
            for(var input of inputs){
                if(!_this.handleValidate({target: input})){
                    isValid = false;
                    break;
                }
            }
            if(isValid){
                var formValue = Array.from(inputs).reduce((values, input)=>{
                    values[input.name] = input.value;
                    return values;
                }, {});
                console.log(formValue);
            }
        }
    }
    handleValidate(event){
        var rules = this.formRules[event.target.name];
        var messageError;
        for(var rule of rules){
            messageError = rule(event.target.value);
            if(messageError) break;
        }
        if(messageError){
            var groupElement = event.target.closest(this.formGroupSelector);
            if(groupElement){
                var errorElement = groupElement.querySelector(this.errorSelector);
                if(errorElement){
                    errorElement.innerText = messageError;
                    groupElement.classList.add("invalid");
                }
            }
        }
        return !messageError;
    }
    handleClearError(event){
        var groupElement = event.target.closest(this.formGroupSelector);
        if(groupElement){
            var errorElement = groupElement.querySelector(this.errorSelector);
            if(errorElement){
                errorElement.innerText = "";
                groupElement.classList.remove("invalid");
            }
        }
    }
};