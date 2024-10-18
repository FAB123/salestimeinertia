<?php

namespace App\Models\Workorders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkorderUpdate extends Model
{
    protected $guarded = [];

    use HasFactory;

    public function details()
    {
        return $this->hasOne(WorkorderStatus::class,  'id', 'workorder_status');
    }
}
