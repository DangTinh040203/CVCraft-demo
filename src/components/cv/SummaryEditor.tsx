import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Label } from '@/components/ui/label';

interface SummaryEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link'
];

const SummaryEditor = ({ value, onChange }: SummaryEditorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Professional Summary
      </Label>
      <div className="bg-background/50 rounded-lg border border-input overflow-hidden [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-input [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-foreground [&_.ql-editor.ql-blank::before]:text-muted-foreground">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write a brief summary of your professional background, key achievements, and career goals..."
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Use formatting to highlight key achievements and skills.
      </p>
    </div>
  );
};

export default SummaryEditor;
