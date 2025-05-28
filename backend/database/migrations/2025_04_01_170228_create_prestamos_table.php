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
        Schema::create('prestamos', function (Blueprint $table) {
            $table-> engine = 'innoDB';
            $table->id();
            $table->datetime('fecha_prestamo');
            $table->datetime('fecha_devolucion');
            $table->string('practica', 50);

            $table->foreignId('id_estudiante')->constrained('estudiantes');
            $table->foreignId('id_maestro')->constrained('maestros');
            $table->foreignId('id_encargado')->constrained('encargados');
            $table->foreignId('id_materia')->constrained('materias');
            
            $table->softDeletes();
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestamos');
    }
};
