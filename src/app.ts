interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
function validate(validatableInput: Validatable) {
  
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length > 0;
    
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLength;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value < validatableInput.max;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }
  return isValid;
}

//Project List Class
class ProjectList{
  templateElement: HTMLTemplateElement;
  hostElement:HTMLDivElement;
  sectionElement:HTMLElement
  

  constructor(private type: "active" | "finished"){
    this.templateElement = document.querySelector("#project-list")! as HTMLTemplateElement;
    this.hostElement = document.querySelector("#app")! as HTMLDivElement;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.sectionElement = importedNode.firstElementChild as HTMLElement;
    this.sectionElement.id = `${type}-projects`
    this.attach();
    this.renderContent();

  }

 private renderContent(){
  const ListId = `${this.type}-projects-list`;
   const ulList = this.sectionElement.querySelector("ul")! as HTMLUListElement;
   ulList.id = ListId;
   const sectionHeaderH2 = this.sectionElement.querySelector("h2")! as HTMLElement;
   sectionHeaderH2.textContent = `${this.type.toUpperCase()} PROJECTS`

 } 
  private attach(){
    this.hostElement.insertAdjacentElement("beforeend",this.sectionElement)
  }

}

//Project Input Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  // for error handling
  

  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = "user-input";
    this.titleInputElement = this.formElement.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherInput(): [string, string, number] | void {
    const gatheredTitle = this.titleInputElement.value;
    const gatheredDescription = this.descriptionInputElement.value;
    const gatheredPeople = this.peopleInputElement.value;

    const validateTitle: Validatable = {
      value: gatheredTitle,
      required: true,
      minLength: 5,
      maxLength: 30,
    };

    const validateDescription: Validatable = {
      value: gatheredDescription,
      required: true,
      minLength: 5,
      maxLength: 100,
    };
    const validatePeople = {
      value: gatheredPeople,
      min: 1,
      max: 5,
      required: true,
    };
    if (
      validate(validateTitle) &&
      validate(validateDescription) &&
      validate(validatePeople)
    ) {
      return [gatheredTitle, gatheredDescription, +gatheredPeople];
    } else {
      alert("Fill all areas");
      return;
    }
  }

  private clearInput() {
    this.titleInputElement.value = "";
    this.peopleInputElement.value = "";
    this.descriptionInputElement.value = "";
  }

  submitHandler(event: Event) {
    event.preventDefault();
    const formInputs = this.gatherInput();
    if (Array.isArray(formInputs)) {
      const [title, description, people] = formInputs;
      console.log(title, description, people);
      this.clearInput();
    }
  }
  configure() {
    this.formElement.addEventListener("submit", this.submitHandler.bind(this));
  }
  attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
  }
}

const newIns = new ProjectInput();
const activePrjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished")
