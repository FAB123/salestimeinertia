<?php

namespace App\Models\Configurations;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceTemplate extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $primaryKey = 'template_id';
    public $timestamps = false;

    // public function getTemplateOptionsAttribute()
    // {
    //     return json_decode($this->options);
    // }

    // protected $appends = ['template_options'];

    protected $casts = [
        'options' => 'array',
    ];
}
