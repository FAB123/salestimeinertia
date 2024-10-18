<?php

namespace App\Models\Requisition;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Requisition extends Model
{
    use HasFactory;
    protected $guarded = [];
    protected $primaryKey = 'requisition_id';
}
