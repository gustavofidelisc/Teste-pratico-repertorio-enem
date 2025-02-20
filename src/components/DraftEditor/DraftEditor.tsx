import style from './DraftEditor.module.css'
import { Paragraph } from '../Paragraph/Paragraph'
import { useEffect, useState } from 'react'


interface IEssayItem {
    id: number
    paragraphs: string[]
}

export const DraftEditor: React.FC = () => {
    const [paragraph, setParagraph] = useState("    ");
    const essayLocalStorage = localStorage.getItem("essay")
    let essayData = essayLocalStorage ? JSON.parse(essayLocalStorage) : { id: 1, paragraphs: [] };

    const [essay, setEssay] = useState<IEssayItem>(essayData);
    const [paragraphCount, setParagraphCount] = useState(0);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Estados para edição do modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedText, setEditedText] = useState("");

    const addParagraph = (paragraph: string) => {
        setEssay((prevEssay) => ({
            ...prevEssay,
            paragraphs: [...prevEssay.paragraphs, paragraph]
        }))
        setParagraph("    ")
    }

    useEffect(() => {
        setParagraphCount(essay.paragraphs.length)
    }, [essay.paragraphs])

    const saveInLocalStorage = () => {
        localStorage.setItem("essay", JSON.stringify(essay));
        alert("Redação salva com sucesso.")
    }

    // Função para abrir o modal de edição
    const openEditModal = (index: number) => {
        setEditingIndex(index);
        setEditedText(essay.paragraphs[index]);
        setIsModalOpen(true);
    }

    // Salvar a edição no array de parágrafos
    const saveEditedParagraph = () => {
        if (editingIndex !== null) {
            setEssay((prevEssay) => {
                const updatedParagraphs = [...prevEssay.paragraphs];
                updatedParagraphs[editingIndex] = editedText;
                return { ...prevEssay, paragraphs: updatedParagraphs };
            });
            setIsModalOpen(false);
        }
    };

    // Deleta o parágrafo no índice informado
    const deleteParagraph = (index: number) => {
        setEssay((prevEssay) => {
            const newParagraphs = prevEssay.paragraphs.filter((_, idx) => idx !== index);
            return { ...prevEssay, paragraphs: newParagraphs };
        });
    };

    return (
        <main className={style.page}>
            <h1>Repertório Enem</h1>
            <h2 id="essay">Faça sua redação</h2>

            <div className={style.draftEditor}>
                {essay.paragraphs.map((paragraph, index) => (
                    <div
                        key={index}
                        className={style.paragraphContainer}
                        onMouseOver={() => setActiveIndex(index)}
                        onMouseOut={() => setActiveIndex(null)}
                    >
                        {activeIndex === index && (
                            <div className={style.buttons}>
                                <button onClick={() => openEditModal(index)} className={style.button_update}>editar</button>
                                <button onClick={() => deleteParagraph(index)} className={style.button_delete}>deletar</button>
                            </div>
                        )}
                        <Paragraph text={paragraph} />
                    </div>
                ))}
            </div>

            {(paragraphCount > 0) && (<button className={style.button_draft} onClick={() => saveInLocalStorage()}>Salvar redação</button>)}

            <h2>Escreva seu novo parágrafo</h2>
            <textarea className={style.new_paragraph} name="paragraph" value={paragraph} onChange={(e) => setParagraph(e.target.value)}></textarea>
            <button className={style.button_draft} onClick={() => addParagraph(paragraph)}>Adicionar parágrafo</button>

            {/* MODAL DE EDIÇÃO */}
            {isModalOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modal}>
                        <h2>Editar Parágrafo</h2>
                        <textarea
                            className={style.edit_textarea}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                        ></textarea>
                        <button className={style.button_save} onClick={saveEditedParagraph}>Salvar</button>
                        <button className={style.button_cancel} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </main>
    )
}
