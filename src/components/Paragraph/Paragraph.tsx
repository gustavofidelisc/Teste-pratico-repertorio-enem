import style from "./Paragraph.module.css"
import { useState } from "react"

interface IParagraphProps {
    text: string;
    onClick?: () => void
}

export const Paragraph : React.FC<IParagraphProps>= ({text, onClick}) =>{    
    return (
        <div className={style.paragraph}>
            <p className={style.paragraph_text}  onClick={onClick}>{text}</p>
        </div>
    )
}