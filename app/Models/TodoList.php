<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\SoftDeletes;


class TodoList extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    protected $primaryKey = 'todo_id';

    protected function tags(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value),
        );
    }

    protected $casts = [
        'done'  => 'boolean',
        'todo_date'  => 'datetime',
    ];

    public function getEncryptedTodoAttribute()
    {
        return encrypt($this->todo_id);
    }

    protected $appends = ['encrypted_todo'];
}
