<?php

namespace App\Models\Workorders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkorderStatus extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $guarded = [];
}
