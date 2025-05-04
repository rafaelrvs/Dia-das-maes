import { ReactNode } from "react";

type SelectProps =React.ComponentProps<"select"> &{
      children: ReactNode;
}
export default function FormsSelect ( {children,
    ...props}:SelectProps){
return(
    <select {...props}>
            {children}
    </select>
)
}