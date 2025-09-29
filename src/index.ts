// A file is required to be in the root of the /src directory by the TypeScript compiler
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}
