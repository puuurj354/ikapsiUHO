import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Heading2,
    ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    Undo,
} from 'lucide-react';
import { useCallback } from 'react';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

export function TiptapEditor({
    content,
    onChange,
    placeholder = 'Tulis artikel Anda di sini...',
    className = '',
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] px-4 py-3',
            },
        },
    });

    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL:', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;

        const url = window.prompt('URL Gambar:');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={`rounded-md border ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={
                        editor.isActive('heading', { level: 2 })
                            ? 'bg-muted'
                            : ''
                    }
                >
                    <Icon iconNode={Heading2} className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                >
                    <Icon iconNode={Bold} className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-muted' : ''}
                >
                    <Icon iconNode={Italic} className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                >
                    <Icon iconNode={List} className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                >
                    <Icon iconNode={ListOrdered} className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                >
                    <Icon iconNode={Quote} className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={setLink}
                    className={editor.isActive('link') ? 'bg-muted' : ''}
                >
                    <Icon iconNode={LinkIcon} className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addImage}
                >
                    <Icon iconNode={ImageIcon} className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Icon iconNode={Undo} className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Icon iconNode={Redo} className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} className="min-h-[300px]" />
        </div>
    );
}
