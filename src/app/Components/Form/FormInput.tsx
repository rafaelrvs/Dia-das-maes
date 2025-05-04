"use client"
type InputRootProps = React.ComponentProps<"input">

export default function FormInput(
    {
        ...props
      }: InputRootProps
){
return(
    <div>
       <input {...props} />
    </div>
)
}