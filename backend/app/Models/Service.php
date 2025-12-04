<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = "services";         // correct table name             // since your table has created_at & updated_at
    protected $primaryKey = 'services_id'; 
    // Disable Laravel's automatic timestamp handling
    public $timestamps = false;

    // Allow mass assignment for these fields
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'category',
        'location',
        'price',
        'available_time',
        'created_at',
        'updated_at'
    ];

    public function profilePicture()
    {
        return $this->hasOne(ProfilePicture::class, 'user_id', 'user_id');
    }

}
