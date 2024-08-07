import {Image, Modal, ModalProps} from "antd";

type PropsType = ModalProps & {
    imagePath: string
}

export default function RecipeItemImageModal(props: PropsType) {
    return <Modal
        {...props}
    >
        <Image src={props.imagePath} preview={false}/>
    </Modal>
};