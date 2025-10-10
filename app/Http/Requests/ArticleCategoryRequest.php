<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ArticleCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $categoryId = $this->route('category') ? $this->route('category')->id : null;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('article_categories')->ignore($categoryId),
            ],
            'description' => 'nullable|string|max:500',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama kategori wajib diisi',
            'name.unique' => 'Kategori dengan nama ini sudah ada',
            'color.required' => 'Warna kategori wajib dipilih',
            'color.regex' => 'Format warna harus HEX (contoh: #6366f1)',
        ];
    }
}
