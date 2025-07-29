<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
    'name', 'email', 'phone', 'birthday',
    'country', 'city', 'district', 'address'
];

}
