<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('estudiantes', function (Blueprint $table) {
            $table-> engine = 'innoDB';
            $table->id(); 
            $table->string('numero_Control', 12)->unique(); 
            $table->string('nombre', 30);
            $table->string('apellido', 50);
            $table->string('carrera', 30);
            $table->string('semestre', 30);
            $table->string('imagen')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudiantes');
    }
};
