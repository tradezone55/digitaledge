export const inputLists: InputField[] = [
  {
    label: "Name",
    type: "text",
    placeholder: "Name",
    name: "name",
    required: true,
  },
  {
    label: "Email",
    type: "email",
    placeholder: "Email",
    name: "email",
    required: true,
  },
  {
    label: "Password",
    type: "password",
    placeholder: "Password",
    name: "password",
    required: true,
  },
  {
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm Password",
    name: "confirmPassword",
    required: true,
  },
];

export interface InputField {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  required: boolean;
}