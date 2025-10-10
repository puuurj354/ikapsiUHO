<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArticleStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'article_category_id' => 'nullable|exists:article_categories,id',
            'featured_image' => 'nullable|image|max:2048|mimes:jpg,jpeg,png,webp',
            'is_published' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul artikel wajib diisi',
            'title.max' => 'Judul artikel maksimal 255 karakter',
            'content.required' => 'Konten artikel wajib diisi',
            'excerpt.max' => 'Ringkasan maksimal 500 karakter',
            'featured_image.image' => 'File harus berupa gambar',
            'featured_image.max' => 'Ukuran gambar maksimal 2MB',
            'featured_image.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WebP',
        ];
    }
}
