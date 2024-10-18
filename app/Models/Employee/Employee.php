<?php

namespace App\Models\Employee;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Employee extends Authenticatable
{

    use HasFactory, HasApiTokens, SoftDeletes, HasRoles;

    protected $guarded = [];
    protected $primaryKey = 'employee_id';
    protected $hidden = ['password', 'remember_token', 'employee_id', 'created_at', 'updated_at', 'deleted_at'];

    // public function getStatusFormatedAttribute()
    // {
    //     return ($this->status == 0) ? 'Blocked' : 'Active';
    // }

    public function getEncryptedEmployeeAttribute()
    {
        return encrypt($this->employee_id);
    }
    //protected $tabele = 'users'; //call database as users

    //creating scope for easy access status  ==1
    // public function scopeActive($query){
    //     return $query->where('status', 1);
    // }

    public function getEncryptedDeleteKeyAttribute()
    {
        return encrypt($this->employee_id);
    }

    protected $appends = ['encrypted_employee', 'encrypted_delete_key'];
}
