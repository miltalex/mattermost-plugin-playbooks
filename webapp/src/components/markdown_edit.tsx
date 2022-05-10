import React, {useState} from 'react';
import styled, {css} from 'styled-components';
import {useIntl} from 'react-intl';

import {useUpdateEffect} from 'react-use';

import MarkdownTextbox from 'src/components/markdown_textbox';

import FormattedMarkdown from 'src/components/formatted_markdown';

import {CancelSaveButtons, CancelSaveContainer} from './checklist_item/inputs';
import {ButtonIcon} from './assets/buttons';
import ShowMore from './widgets/show_more';

interface TextEditProps {
    value: string;
    onSave: (value: string) => void;
    placeholder: string;
    className?: string;
    noBorder?: boolean;
    disabled?: boolean;
    previewDisabled?: boolean;
}

const MarkdownEdit = (props: TextEditProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(props.value);
    useUpdateEffect(() => {
        setValue(props.value);
    }, [props.value]);

    if (isEditing) {
        return (
            <MarkdownEditContainer
                dashed={false}
                editing={true}
                className={props.className}
            >
                <MarkdownTextbox
                    data-testid={'rendered-editable-text'}
                    id={'editabletext-markdown-textbox'}
                    value={value}
                    placeholder={props.placeholder}
                    setValue={setValue}
                    autoFocus={true}
                    disabled={props.disabled}
                    previewDisabled={props.previewDisabled ?? true}
                />
                <CancelSaveButtons
                    onCancel={() => {
                        setIsEditing(false);
                        setValue(props.value);
                    }}
                    onSave={() => {
                        setIsEditing(false);
                        props.onSave(value);
                    }}
                />
            </MarkdownEditContainer>
        );
    }

    return (
        <MarkdownEditContainer
            editing={isEditing}
            dashed={value === ''}
            noBorder={props.noBorder}
            className={props.className}
            onClick={() => !value && setIsEditing(true)}
        >
            {!isEditing && <HoverMenu onEdit={() => setIsEditing(true)}/>}
            <RenderedText
                data-testid='rendered-text'
            >
                {value ? (
                    <ShowMore>
                        <FormattedMarkdown value={value}/>
                    </ShowMore>
                ) : (
                    <PlaceholderText>
                        <FormattedMarkdown value={props.placeholder}/>
                    </PlaceholderText>
                )}
            </RenderedText>
        </MarkdownEditContainer>
    );
};

const HoverMenuContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0px 8px;
    position: absolute;
    height: 32px;
    right: 2px;
    top: 8px;
    z-index: 1;
`;

const commonTextStyle = css`
    display: block;
    align-items: center;
    border-radius: var(--markdown-textbox-radius, 4px);
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: rgba(var(--center-channel-color-rgb), 0.72);
    padding: var(--markdown-textbox-padding, 12px 30px 12px 16px);

    :hover {
        cursor: text;
    }

    p {
        white-space: pre-wrap;
    }
`;

const MarkdownEditContainer = styled.div<{editing: boolean;dashed: boolean;noBorder?: boolean;}>`
    position: relative;
    box-sizing: border-box;
    border-radius: var(--markdown-textbox-radius, 4px);

    ${CancelSaveContainer} {
        padding: 8px 0;
    }

    && .custom-textarea.custom-textarea {
        ${commonTextStyle}
    }


    ${HoverMenuContainer} {
        opacity: 0
    }
    &:hover,
    &:focus-within {
        ${HoverMenuContainer} {
            opacity: 1;
        }

        ${({noBorder}) => noBorder && css`
            border: 1px solid rgba(var(--center-channel-color-rgb), 0.08);
        `}
    }

    background: var(--center-channel-bg);
    border: ${(props) => (props.dashed ? '1px dashed var(--center-channel-color-16)' : '1px solid var(--center-channel-color-08)')};
    ${({editing, noBorder}) => (editing || noBorder) && css`
        border-color: transparent;
    `}
`;

export const RenderedText = styled.div`
    ${commonTextStyle}

    p:last-child {
        margin-bottom: 0;
    }
`;

const PlaceholderText = styled.span`
    font-style: italic;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: rgba(var(--center-channel-color-rgb), 0.56);
`;

export default styled(MarkdownEdit)``;

interface HoverMenuProps {
    onEdit: () => void;
}

const HoverMenu = (props: HoverMenuProps) => {
    const {formatMessage} = useIntl();

    return (
        <HoverMenuContainer>
            <ButtonIcon
                data-testid='hover-menu-edit-button'
                title={formatMessage({defaultMessage: 'Edit'})}
                className={'icon-pencil-outline icon-16 btn-icon'}
                onClick={() => props.onEdit()}
            />
        </HoverMenuContainer>
    );
};
