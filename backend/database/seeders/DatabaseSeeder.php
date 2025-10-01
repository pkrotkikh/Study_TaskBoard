<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Task;
use App\Models\Project;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);

        $project = Project::create([
            'title' => 'Demo Project',
            'description' => 'Project created by seeder',
            'owner_id' => $admin->id
        ]);

        $task = Task::create([
            'project_id' => $project->id,
            'title' => 'First task',
            'description' => 'This is a demo',
            'status' => 'todo',
            'order' => 1
        ]);
    }
}
