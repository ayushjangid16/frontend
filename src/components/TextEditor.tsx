import { useState } from "react";
import RichTextEditor from "reactjs-tiptap-editor";

import { BaseKit } from "reactjs-tiptap-editor";
import { Bold } from "reactjs-tiptap-editor/lib/Bold.js";
import { BulletList } from "reactjs-tiptap-editor/lib/BulletList.js";
import { Color } from "reactjs-tiptap-editor/lib/Color.js";
import { FontFamily } from "reactjs-tiptap-editor/lib/FontFamily.js";
import { FontSize } from "reactjs-tiptap-editor/lib/FontSize.js";
import { Heading } from "reactjs-tiptap-editor/lib/Heading.js";
import { Highlight } from "reactjs-tiptap-editor/lib/Highlight.js";
import { History } from "reactjs-tiptap-editor/lib/History.js";
import { Italic } from "reactjs-tiptap-editor/lib/Italic.js";

import "reactjs-tiptap-editor/style.css";

const extensions = [
  BaseKit,
  Heading,
  Italic,
  Bold,
  BulletList,
  Color,
  Highlight,
  FontFamily,
  FontSize,
  History,
];

function TextEditor() {
  const [content, setContent] = useState<string>("");

  const onChangeContent = (value: string) => {
    setContent(value);

    console.log(value);
  };

  return (
    <RichTextEditor
      output="text"
      content={content}
      hideToolbar={false}
      onChangeContent={onChangeContent}
      extensions={extensions}
    />
  );
}

export default TextEditor;
