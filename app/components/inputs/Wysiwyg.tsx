'use client';

import React, { use, useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { Controller, Control } from 'react-hook-form';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export interface WYSIWYGEditorProps {
  label: string;
  id: string;
  control: Control<any>;
  errors: Record<string, any>;
  required?: boolean;
  disabled?: boolean;
  placeHolder?: string;
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'list', 'bullet', 'indent',
  'align',
  'link', 'image', 'video',
];

const Wysiwyg: React.FC<WYSIWYGEditorProps> = ({
  label,
  id,
  control,
  errors,
  required,
  disabled,
  placeHolder,
}) => {

  const quillRef = useRef<ReactQuill|null>(null);

  const handleEmbedImage = () => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const link = prompt('Ingrese el enlace de la imagen:');
      if (link) {
        const range = editor.getSelection();
        editor.insertEmbed(range?.index || 0, 'image', link);
      }
    }
  };

  useEffect(() => {
    if (window) {
      let Image = Quill.import('formats/image');
      Image.className = 'ql-embed-image';
      Quill.register(Image, true);
    }
  }, [quillRef])

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'video', 'image'],
        ['clean'],
      ],
      handlers: {
        image: handleEmbedImage,
      }
    },
  }),[])

  return (
    <div>
      <label
        className="
          block
          text-sm
          text-gray-900
          font-medium
          leading-6
        "
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <ReactQuill
              {...field} // Incluye onChange y value automáticamente
              id={id}
              ref={quillRef}
              theme="snow"
              readOnly={disabled}
              placeholder={placeHolder}
              className={clsx(
                `block w-full rounded-md border-0 text-black shadow-sm 
                ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-900 
                placeholder:text-gray-400 sm:text-sm sm:leading-6`,
                errors[id] && 'focus:ring-rose-500',
                disabled && 'opacity-50 cursor-default',
                '.ql-container',
                'ql-toolbar'
              )}
              modules={modules}
              formats={formats}
            />
          )}
        />
        {errors[id] && (
          <p className="mt-1 text-sm text-rose-500">{errors[id]?.message || 'Este campo es obligatorio'}</p>
        )}
      </div>
    </div>
  );
};

export default Wysiwyg;
