
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const resolutionSchema = z.object({
  resolution_notes: z.string().min(50, { message: "Resolution summary must be at least 50 characters." }),
  witness_info: z.string().optional(),
  evidence_files: z.custom<FileList>().optional(),
});

type ResolutionFormValues = z.infer<typeof resolutionSchema>;

interface ResolutionSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
  onSubmit: (assignmentId: string, data: any) => Promise<void>;
}

const ResolutionSubmissionDialog: React.FC<ResolutionSubmissionDialogProps> = ({ open, onOpenChange, assignmentId, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResolutionFormValues>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: {
      resolution_notes: '',
      witness_info: '',
    },
  });

  const handleFormSubmit = async (values: ResolutionFormValues) => {
    setIsSubmitting(true);
    let uploadedFiles: { url: string; name: string; type: string; }[] = [];

    if (values.evidence_files && values.evidence_files.length > 0) {
      const files = Array.from(values.evidence_files);
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${assignmentId}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resolution-evidence')
          .upload(filePath, file);

        if (uploadError) {
          toast({ title: 'Upload Failed', description: `Could not upload ${file.name}: ${uploadError.message}`, variant: 'destructive' });
          setIsSubmitting(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage.from('resolution-evidence').getPublicUrl(filePath);
        uploadedFiles.push({ url: publicUrl, name: file.name, type: file.type });
      }
    }

    const resolutionData = {
      resolution_notes: values.resolution_notes,
      witness_info: values.witness_info,
      resolution_evidence: uploadedFiles.length > 0 ? uploadedFiles : null,
    };

    await onSubmit(assignmentId, resolutionData);
    
    setIsSubmitting(false);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Submit Resolution Report</DialogTitle>
          <DialogDescription>
            Provide a detailed account of actions taken and upload supporting evidence. This will be reviewed by an administrator.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="resolution_notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolution Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the actions taken, outcomes, and final status of the incident."
                      className="bg-gray-700 border-gray-600 min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="witness_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Witness Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide names and contact details of any witnesses. One per line."
                      className="bg-gray-700 border-gray-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="evidence_files"
              render={({ field: { onChange, value, ...rest } }) => (
                 <FormItem>
                  <FormLabel>Supporting Evidence</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      className="bg-gray-700 border-gray-600 file:text-white"
                      onChange={(e) => onChange(e.target.files)}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-gray-600 text-gray-300">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Review
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ResolutionSubmissionDialog;
