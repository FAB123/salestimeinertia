<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessagesTemplate extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $primaryKey = 'template_id';
    public $timestamps = false;
}
