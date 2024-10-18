<?php

namespace App\Models\Requisition;

use App\Models\Item\Item;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequisitionItem extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $guarded = [];
    public function details()
    {
        return $this->hasOne(Item::class, 'item_id', 'item_id');
    }
}
