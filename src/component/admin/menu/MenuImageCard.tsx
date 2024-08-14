import {Button, Card, Flex, Image, message, Upload} from "antd";
import {CheckCircleOutlined, CloseOutlined, UploadOutlined} from "@ant-design/icons";
import React, {useRef} from "react";
import {proxy, useSnapshot} from "valtio";

type PropsType = {
    imagePath: string | null
    onSave: (url: string) => void
}

type StateType = {
    imagePath: string | null
}

export default function MenuImageCard(props: PropsType) {
    const state = useRef<StateType>(proxy({
        imagePath: props.imagePath
    })).current

    useSnapshot(state, {sync: true})

    function onUpload(e) {
        if (e.file.status !== 'done' || !e.file.response) {
            return
        }

        if (e.file.status === 'error') {
            message.error(`파일 업로드에 실패하였습니다. ${e.file.response.message}`)
            return
        }

        state.imagePath = e.file.response.url;
    }

    function clear() {
        state.imagePath = null
    }

    return <Card>
        <Flex gap={10} vertical>
            {
                state.imagePath !== null ?
                    <Image
                        alt={'레시피 사진'}
                        src={state.imagePath}
                    /> :
                    <Image
                        alt={'레시피 사진'}
                        src={'/image_not_found.png'}
                        preview={false}
                    />
            }
            <Flex justify={'right'} gap={5}>
                <Upload
                    method={'POST'}
                    action={'/api/v1/files'}
                    accept="image/*,application/pdf"
                    listType="picture"
                    maxCount={1}
                    onChange={(e) => onUpload(e)}
                    onRemove={clear}
                    progress={{strokeWidth: 2}}
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined/>}/>
                </Upload>
                {
                    state.imagePath !== null &&
                    <Button onClick={clear} icon={<CloseOutlined style={{color: '#de0000'}}/>}/>
                }
                <Button onClick={() => props.onSave(state.imagePath!)}
                        icon={<CheckCircleOutlined style={{color: '#3dde00'}}/>}/>
            </Flex>
        </Flex>
    </Card>
};