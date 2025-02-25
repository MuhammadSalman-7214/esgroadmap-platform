'use client'
import type { ReactQuillProps } from "react-quill";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

// @ts-expect-error No need for ts definition
import imageUploader from "quill-image-uploader";

Quill.register("modules/imageUploader", imageUploader);

export default function QuillEditor(props: ReactQuillProps) {
	return <ReactQuill {...props} theme="snow" className="custom-quill" />;
}
